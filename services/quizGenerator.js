const Question = require('../models/Question')

/**
 * Adaptive quiz generator — section 3.4.1 pseudocode from the project spec.
 * Prioritises weak topics (40% of slots), fills rest with target difficulty,
 * falls back to adjacent difficulty if pool is thin.
 */
async function generateQuiz(courseId, difficulty, { totalQuestions = 10, weakTopics = [], topics = null } = {}) {
  const topicFilter = topics?.length ? { topic: { $in: topics } } : {}
  let pool = await Question.find({ course: courseId, difficulty, ...topicFilter }).lean()

  // Fallback to adjacent difficulty if pool too small
  if (pool.length < totalQuestions) {
    const fallback = difficulty === 'Medium' ? { $in: ['Easy','Hard'] } : 'Medium'
    const extras   = await Question.find({ course: courseId, difficulty: fallback, ...topicFilter }).lean()
    pool = [...pool, ...extras]
  }

  if (!pool.length) return []

  const weakPool   = pool.filter(q => weakTopics.includes(q.topic))
  const strongPool = pool.filter(q => !weakTopics.includes(q.topic))

  const weakSlots   = Math.min(Math.floor(totalQuestions * 0.4), weakPool.length)
  const strongSlots = totalQuestions - weakSlots

  const selected = [
    ...shuffle(weakPool).slice(0, weakSlots),
    ...shuffle(strongPool).slice(0, strongSlots),
  ]

  // Pad if still short
  if (selected.length < totalQuestions) {
    const used = new Set(selected.map(q => q._id.toString()))
    const pad  = pool.filter(q => !used.has(q._id.toString()))
    selected.push(...shuffle(pad).slice(0, totalQuestions - selected.length))
  }

  // If a topic-restricted pool couldn't fill the quiz (e.g. too few questions
  // written for the first-half topics), top up from the full course pool.
  if (selected.length < totalQuestions && topics?.length) {
    const used = new Set(selected.map(q => q._id.toString()))
    const wider = await Question.find({ course: courseId, _id: { $nin: [...used] } }).lean()
    selected.push(...shuffle(wider).slice(0, totalQuestions - selected.length))
  }

  // Strip correctAnswer before sending to client
  return shuffle(selected).slice(0, totalQuestions).map(({ _id, topic, text, type, options, difficulty }) => ({
    _id, topic, text, type, options, difficulty,
  }))
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

module.exports = { generateQuiz }

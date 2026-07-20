const Question            = require('../models/Question')
const Course              = require('../models/Course')
const { generateQuestionsAI } = require('../services/aiService')

exports.getQuestions = async (req, res, next) => {
  try { res.json(await Question.find({ course: req.params.courseId }).sort({ topic: 1, difficulty: 1 })) }
  catch (e) { next(e) }
}

exports.createQuestion = async (req, res, next) => {
  try { res.status(201).json(await Question.create(req.body)) }
  catch (e) { next(e) }
}

exports.updateQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!q) return res.status(404).json({ message: 'Question not found' })
    res.json(q)
  } catch (e) { next(e) }
}

exports.deleteQuestion = async (req, res, next) => {
  try { await Question.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }) }
  catch (e) { next(e) }
}

// POST /api/questions/generate — AI bulk generation for instructors
exports.generateWithAI = async (req, res, next) => {
  try {
    const { courseId, topic, difficulty, count = 5 } = req.body
    if (!courseId || !topic || !difficulty)
      return res.status(400).json({ message: 'courseId, topic, and difficulty required' })
    const course = await Course.findById(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const generated = await generateQuestionsAI(course.title, topic, difficulty, count, courseId)
    const saved     = await Question.insertMany(generated)
    res.status(201).json({ message: `${saved.length} questions generated`, questions: saved })
  } catch (e) {
    if (e.message?.includes('JSON')) return res.status(502).json({ message: 'AI returned invalid response. Try again.' })
    next(e)
  }
}

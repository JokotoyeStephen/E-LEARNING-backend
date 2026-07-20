const User        = require('../models/User')
const QuizAttempt = require('../models/QuizAttempt')

const MONTHS_BACK = 6

// Study time isn't tracked precisely anywhere in the app (no session/heartbeat
// logging), so "hours studied" is derived as an estimate from activity counts
// using rough average session lengths. This is flagged explicitly in the API
// response and the UI so it's never presented as measured data.
const AVG_LESSON_MINUTES = 12
const AVG_QUIZ_MINUTES   = 8

function monthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function monthLabel(key) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}
function lastNMonthKeys(n) {
  const out = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    out.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)))
  }
  return out
}

// GET /api/analytics
exports.getOverview = async (req, res, next) => {
  try {
    const user     = await User.findById(req.user._id).populate('enrolledCourses.course')
    const attempts = await QuizAttempt.find({ student: req.user._id }).sort({ completedAt: 1 })
    const log      = user.topicCompletionLog || []

    // ---- Monthly progress (last 6 months) ----
    const monthKeys    = lastNMonthKeys(MONTHS_BACK)
    const monthBuckets = Object.fromEntries(monthKeys.map(k => [k, { lessonsCompleted: 0, quizzesTaken: 0, scoreSum: 0 }]))

    log.forEach(entry => {
      const key = monthKey(entry.completedAt)
      if (monthBuckets[key]) monthBuckets[key].lessonsCompleted++
    })
    attempts.forEach(a => {
      const key = monthKey(a.completedAt)
      if (monthBuckets[key]) {
        monthBuckets[key].quizzesTaken++
        monthBuckets[key].scoreSum += a.score
      }
    })

    const monthlyProgress = monthKeys.map(k => ({
      month:            monthLabel(k),
      lessonsCompleted: monthBuckets[k].lessonsCompleted,
      quizzesTaken:     monthBuckets[k].quizzesTaken,
      avgScore:         monthBuckets[k].quizzesTaken ? Math.round(monthBuckets[k].scoreSum / monthBuckets[k].quizzesTaken) : 0,
    }))

    // ---- Quiz performance timeline (most recent 20 attempts) ----
    const courseTitleById = Object.fromEntries(
      (user.enrolledCourses || []).filter(e => e.course).map(e => [e.course._id.toString(), e.course.title])
    )
    const quizPerformance = attempts.slice(-20).map(a => ({
      date:       a.completedAt.toISOString().slice(0, 10),
      score:      a.score,
      difficulty: a.difficulty,
      course:     courseTitleById[a.course?.toString()] || 'Course',
    }))

    // ---- Skill improvement per topic (first attempt vs most recent) ----
    const topicHistory = {}
    attempts.forEach(a => {
      const breakdown = Object.fromEntries(a.topicBreakdown || [])
      Object.entries(breakdown).forEach(([topic, stats]) => {
        if (!topicHistory[topic]) topicHistory[topic] = []
        topicHistory[topic].push(stats.accuracy)
      })
    })
    const skillImprovement = Object.entries(topicHistory)
      .map(([topic, scores]) => ({
        topic,
        first:       scores[0],
        latest:      scores[scores.length - 1],
        improvement: scores[scores.length - 1] - scores[0],
        attempts:    scores.length,
      }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 8)

    // ---- Course completion percentage ----
    const courseCompletion = (user.enrolledCourses || []).filter(e => e.course).map(e => {
      const totalTopics = e.course.topics?.length || 0
      const done         = e.completedTopics?.length || 0
      return {
        course:    e.course.title,
        percent:   totalTopics ? Math.round((done / totalTopics) * 100) : 0,
        completed: !!e.completed,
      }
    })

    // ---- Totals / stat cards ----
    const lessonsCompletedTotal = log.length
    const quizzesTakenTotal     = attempts.length
    const avgQuizScore          = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0
    const coursesCompleted      = (user.enrolledCourses || []).filter(e => e.completed).length
    const coursesEnrolled       = (user.enrolledCourses || []).length

    const estimatedMinutes      = lessonsCompletedTotal * AVG_LESSON_MINUTES + quizzesTakenTotal * AVG_QUIZ_MINUTES
    const hoursStudiedEstimate  = Math.round((estimatedMinutes / 60) * 10) / 10

    res.json({
      hoursStudiedEstimate,
      lessonsCompletedTotal,
      quizzesTakenTotal,
      avgQuizScore,
      coursesCompleted,
      coursesEnrolled,
      monthlyProgress,
      quizPerformance,
      skillImprovement,
      courseCompletion,
      hoursStudiedIsEstimate: true,
    })
  } catch (e) { next(e) }
}

const User        = require('../models/User')
const QuizAttempt = require('../models/QuizAttempt')
const { computeBadges } = require('../services/badgeService')

// GET /api/badges — every badge in the catalog, with `earned` set for the
// logged-in student based on their real enrollment + quiz attempt history.
exports.getBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const quizAttempts = await QuizAttempt.find({ student: req.user._id })
      .select('score difficulty passed').lean()

    const badges = computeBadges({
      enrollments: user.enrolledCourses.map(e => e.toObject()),
      quizAttempts,
    })

    res.json({ badges, earnedCount: badges.filter(b => b.earned).length, totalCount: badges.length })
  } catch (e) { next(e) }
}

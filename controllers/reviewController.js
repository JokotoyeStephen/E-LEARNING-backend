const Review = require('../models/Review')
const User   = require('../models/User')

// GET /api/courses/:id/reviews — public-ish (any logged-in user can view)
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.id })
      .populate('student', 'name')
      .sort({ createdAt: -1 })

    const avgRating = reviews.length
      ? +(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

    res.json({
      avgRating,
      totalReviews: reviews.length,
      reviews: reviews.map(r => ({
        _id: r._id,
        studentName: r.student?.name || 'Learnly student',
        rating: r.rating,
        comment: r.comment || '',
        createdAt: r.createdAt,
      })),
    })
  } catch (e) { next(e) }
}

// POST /api/courses/:id/reviews — create or update the caller's own review.
// Only students actually enrolled in the course can review it.
exports.upsertReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const numericRating = Number(rating)
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    const user = await User.findById(req.user._id)
    if (!user.getEnrollment(req.params.id)) {
      return res.status(403).json({ message: 'Enroll in this course before reviewing it' })
    }

    const review = await Review.findOneAndUpdate(
      { course: req.params.id, student: req.user._id },
      { rating: numericRating, comment: (comment || '').trim().slice(0, 1000) },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )
    res.json(review)
  } catch (e) { next(e) }
}

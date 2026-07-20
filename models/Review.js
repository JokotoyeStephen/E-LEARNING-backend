const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  course:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true })

// One review per student per course — resubmitting updates it (upsert).
reviewSchema.index({ course: 1, student: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema)

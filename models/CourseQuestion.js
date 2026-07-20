const mongoose = require('mongoose')

// A student's question on a specific course, answerable by that course's
// instructor. Deliberately simple/flat (one question, one answer) rather
// than a full threaded forum — enough for "students ask, instructor
// answers" without building a whole messaging system.
const courseQuestionSchema = new mongoose.Schema({
  course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  text:       { type: String, required: true, trim: true, maxlength: 1000 },
  answer:     { type: String, trim: true, maxlength: 2000 },
  answeredAt: { type: Date },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('CourseQuestion', courseQuestionSchema)

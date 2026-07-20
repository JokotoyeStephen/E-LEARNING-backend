const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  question:       { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  topic:          { type: String, required: true },
  difficulty:     { type: String, required: true },
  selectedOption: { type: Number },
  correctAnswer:  { type: Number, required: true },
  explanation:    { type: String },
  isCorrect:      { type: Boolean, required: true },
})

const quizAttemptSchema = new mongoose.Schema({
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  difficulty:     { type: String, enum: ['Easy','Medium','Hard'], required: true },
  checkpoint:     { type: String, enum: ['mid','final'], default: 'final' },
  answers:        [answerSchema],
  totalQuestions: { type: Number, required: true },
  correctCount:   { type: Number, required: true },
  score:          { type: Number, required: true },
  passed:         { type: Boolean, required: true },
  topicBreakdown: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  aiFeedback:     { type: String },
  completedAt:    { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema)

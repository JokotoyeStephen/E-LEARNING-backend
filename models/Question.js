const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topic:         { type: String, required: true },
  text:          { type: String, required: true },
  type:          { type: String, enum: ['mcq','true_false'], default: 'mcq' },
  options:       [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation:   { type: String },
  difficulty:    { type: String, enum: ['Easy','Medium','Hard'], required: true },
  source:        { type: String, enum: ['manual','ai'], default: 'manual' },
}, { timestamps: true })

questionSchema.index({ course: 1, difficulty: 1, topic: 1 })

module.exports = mongoose.model('Question', questionSchema)

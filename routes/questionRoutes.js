const r = require('express').Router()
const {
  getQuestions, createQuestion, updateQuestion,
  deleteQuestion, generateWithAI,
} = require('../controllers/questionController')
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware')

r.get('/:courseId',    protect, instructorOrAdmin, getQuestions)
r.post('/generate',    protect, instructorOrAdmin, generateWithAI)
r.post('/',            protect, instructorOrAdmin, createQuestion)
r.put('/:id',          protect, instructorOrAdmin, updateQuestion)
r.delete('/:id',       protect, instructorOrAdmin, deleteQuestion)

module.exports = r

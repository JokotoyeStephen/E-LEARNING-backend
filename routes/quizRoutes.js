const r = require('express').Router()
const { generateQuiz, submitQuiz, getHistory, getProgress } = require('../controllers/quizController')
const { protect } = require('../middleware/authMiddleware')

r.get('/generate/:courseId',  protect, generateQuiz)
r.post('/submit/:courseId',   protect, submitQuiz)
r.get('/history/:courseId',   protect, getHistory)
r.get('/progress/:courseId',  protect, getProgress)

module.exports = r

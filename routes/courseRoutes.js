const r = require('express').Router()
const {
  getCourses, getEnrolledCourses, getMyCourses, getCourseById,
  enrollCourse, createCourse, updateCourse, deleteCourse, completeTopic,
  getCertificate, verifyCertificate,
} = require('../controllers/courseController')
const { getReviews, upsertReview } = require('../controllers/reviewController')
const { getQuestions, askQuestion, answerQuestion } = require('../controllers/discussionController')
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware')

r.get('/',             protect, getCourses)
r.get('/enrolled',     protect, getEnrolledCourses)
r.get('/mine',         protect, instructorOrAdmin, getMyCourses)
// Public — no auth — so anyone with the certificate link/QR code can verify it.
r.get('/certificates/verify/:certificateId', verifyCertificate)
r.get('/:id',          protect, getCourseById)
r.get('/:id/certificate', protect, getCertificate)
r.post('/:id/enroll',  protect, enrollCourse)
r.post('/:id/topics/:topicName/complete', protect, completeTopic)
r.get('/:id/reviews',   protect, getReviews)
r.post('/:id/reviews',  protect, upsertReview)
r.get('/:id/questions',  protect, getQuestions)
r.post('/:id/questions', protect, askQuestion)
r.post('/:id/questions/:questionId/answer', protect, instructorOrAdmin, answerQuestion)
r.post('/',            protect, instructorOrAdmin, createCourse)
r.put('/:id',          protect, instructorOrAdmin, updateCourse)
r.delete('/:id',       protect, instructorOrAdmin, deleteCourse)

module.exports = r

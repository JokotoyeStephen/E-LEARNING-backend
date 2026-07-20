const r = require('express').Router()
const { getOverview, getCourseAnalytics } = require('../controllers/instructorController')
const { protect, instructorOrAdmin } = require('../middleware/authMiddleware')

r.get('/overview',              protect, instructorOrAdmin, getOverview)
r.get('/courses/:id/analytics', protect, instructorOrAdmin, getCourseAnalytics)

module.exports = r

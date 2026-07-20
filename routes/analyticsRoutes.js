const r = require('express').Router()
const { getOverview } = require('../controllers/analyticsController')
const { protect } = require('../middleware/authMiddleware')

r.get('/', protect, getOverview)

module.exports = r

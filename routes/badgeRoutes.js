const r = require('express').Router()
const { getBadges } = require('../controllers/badgeController')
const { protect } = require('../middleware/authMiddleware')

r.get('/', protect, getBadges)

module.exports = r

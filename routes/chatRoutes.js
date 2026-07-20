const r = require('express').Router()
const { sendMessage } = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')

r.post('/', protect, sendMessage)

module.exports = r

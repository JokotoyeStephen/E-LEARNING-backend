const r = require('express').Router()
const { register, login, getMe, verifyEmail, resendOtp } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
r.post('/register', register)
r.post('/verify-email', verifyEmail)
r.post('/resend-otp', resendOtp)
r.post('/login', login)
r.get('/me', protect, getMe)
module.exports = r

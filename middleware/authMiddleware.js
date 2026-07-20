const jwt  = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorised — no token' })
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Not authorised — invalid token' })
  }
}

exports.adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin access required' })

exports.instructorOrAdmin = (req, res, next) =>
  ['admin','instructor'].includes(req.user?.role) ? next() : res.status(403).json({ message: 'Instructor/admin access required' })

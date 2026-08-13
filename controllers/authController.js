const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const User    = require('../models/User')
const pendingRegistrations = require('../services/pendingRegistrations')
const { sendVerificationEmail } = require('../services/emailService')

const sign   = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })
const payload = u => ({ _id: u._id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified })

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' })

    // Only allow student or instructor self-registration (not admin)
    const allowedRoles = ['student', 'instructor']
    const assignedRole = allowedRoles.includes(role) ? role : 'student'

    // Nothing is written to MongoDB here — the account only becomes real
    // once verifyEmail() below succeeds.
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10))
    const code          = generateOtp()
    const otpHash        = await bcrypt.hash(code, await bcrypt.genSalt(10))

    pendingRegistrations.set(email, {
      name, email, passwordHash, role: assignedRole,
      otpHash, otpExpires: Date.now() + pendingRegistrations.OTP_TTL_MS,
    })

    try {
      console.log("reach here");
      
      await sendVerificationEmail(email, name, code)
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr.message)
      // Don't fail registration just because the email didn't send —
      // the user can hit "resend code" from the verify-email screen.
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for a verification code.',
      email,
    })
  } catch (e) {
    console.log(e);

    if (e.code === 11000) {
      return res.status(400).json({
        message: 'Email already registered. Please use a different email.'
      });
    }
    if (e.code === 'ENOTFOUND') {
      return res.status(400).json({
        message: '❌ Network Error: Please check Your internet connection.'
      });
    }
      next(e)
    }
}

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body
    if (!email || !code) return res.status(400).json({ message: 'Email and code required' })

    const entry = pendingRegistrations.get(email)
    if (!entry) {
      return res.status(400).json({ message: 'No pending registration found for this email — it may have expired. Please register again.' })
    }

    const valid = await bcrypt.compare(code, entry.otpHash)
    if (!valid) return res.status(400).json({ message: 'Invalid or expired code' })

    // Guard against a race where the email got registered some other way
    // in the meantime.
    if (await User.findOne({ email })) {
      pendingRegistrations.remove(email)
      return res.status(400).json({ message: 'Email already registered. Please log in instead.' })
    }

    // passwordHash is already bcrypt-hashed — skip the model's pre-save
    // hashing so it isn't hashed a second time.
    const user = new User({
      name: entry.name,
      email: entry.email,
      password: entry.passwordHash,
      role: entry.role,
    })
    user.$locals.skipPasswordHash = true
    await user.save()

    pendingRegistrations.remove(email)

    res.json({ token: sign(user._id), user: payload(user) })
  } catch (e) { next(e) }
}

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })

    const entry = pendingRegistrations.get(email)
    if (!entry) {
      return res.status(404).json({ message: 'No pending registration found for this email. Please register again.' })
    }

    const code    = generateOtp()
    const otpHash = await bcrypt.hash(code, await bcrypt.genSalt(10))
    pendingRegistrations.set(email, {
      ...entry, otpHash, otpExpires: Date.now() + pendingRegistrations.OTP_TTL_MS,
    })

    await sendVerificationEmail(entry.email, entry.name, code)
    res.json({ message: 'A new verification code has been sent to your email.' })
  } catch (e) { next(e) }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email }).select('+password')
    if (user) {
      if (!(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid email or password' })
      return res.json({ token: sign(user._id), user: payload(user) })
    }

    // No verified account exists yet — but maybe they're mid-verification.
    // Checking their password against the pending entry lets us give the
    // right message (verify your email) instead of a misleading
    // "invalid credentials" for someone who typed the right password.
    const pendingEntry = pendingRegistrations.get(email)
    if (pendingEntry && (await bcrypt.compare(password, pendingEntry.passwordHash))) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
      })
    }

    return res.status(401).json({ message: 'Invalid email or password' })
  } catch (e) { next(e) }
}

exports.getMe = (req, res) => res.json(payload(req.user))

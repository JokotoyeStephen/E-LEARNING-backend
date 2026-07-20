// Holds signups that haven't verified their OTP yet — entirely in server RAM.
// A MongoDB User document is only ever created in verifyEmail(), once the
// code checks out. This means:
//   • No "ghost" unverified accounts pile up in the database
//   • Someone who typos an email, or never checks their inbox, doesn't
//     permanently squat that email address — it just expires out of memory
//   • Re-registering the same email before verifying simply overwrites the
//     pending entry and sends a fresh code
//
// Tradeoff: this lives in a single Node process's memory. If the server
// restarts while someone is mid-verification, they'll need to register again.
// Fine for a single-instance app; a multi-instance production deployment
// would move this to Redis (or similar) instead of a plain Map.

const pending = new Map() // email -> { name, email, passwordHash, role, otpHash, otpExpires, createdAt }

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes

function set(email, data) {
  pending.set(email, { ...data, createdAt: Date.now() })
}

function get(email) {
  const entry = pending.get(email)
  if (!entry) return null
  if (entry.otpExpires < Date.now()) {
    pending.delete(email)
    return null
  }
  return entry
}

function remove(email) {
  pending.delete(email)
}

// Periodic sweep so entries that expire but are never retried don't sit in
// memory forever.
const sweeper = setInterval(() => {
  const now = Date.now()
  for (const [email, entry] of pending) {
    if (entry.otpExpires < now) pending.delete(email)
  }
}, 5 * 60 * 1000)
sweeper.unref?.() // don't keep the process alive just for this timer

module.exports = { set, get, remove, OTP_TTL_MS }

const nodemailer = require('nodemailer')

// ── Transporter ───────────────────────────────────────────────────────────────
// Supports either:
//  1) A named service (e.g. Gmail) via EMAIL_USER / EMAIL_PASS (a Gmail "App
//     Password", not your normal password), or
//  2) A generic SMTP host via EMAIL_HOST / EMAIL_PORT / EMAIL_USER / EMAIL_PASS
//
// tls.rejectUnauthorized is set to false as a pragmatic default — some local
// networks/ISPs interfere with TLS certificate validation on port 587.
function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = process.env

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      'Email is not configured. Set EMAIL_USER and EMAIL_PASS (and optionally EMAIL_HOST/EMAIL_PORT) in your .env file.'
    )
  }

  if (EMAIL_HOST) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT) || 587,
      secure: Number(EMAIL_PORT) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    })
  }

  return nodemailer.createTransport({
    service: EMAIL_SERVICE || 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  })
}

// ── Send OTP verification email ────────────────────────────────────────────────
exports.sendVerificationEmail = async (toEmail, toName, code) => {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Learnly" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Learnly verification code',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family:sans-serif;background:#f9fafb;padding:40px 0;margin:0">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;padding:40px">
            <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px">
              Welcome to Learnly, ${toName}! 🎓
            </h1>
            <p style="color:#6b7280;margin:0 0 24px">
              Enter this code on the website to verify your email address:
            </p>
            <div style="font-size:36px;font-weight:800;letter-spacing:12px;color:#2563eb;background:#eff6ff;border-radius:8px;padding:20px;text-align:center">
              ${code}
            </div>
            <p style="color:#9ca3af;font-size:13px;margin:24px 0 0">
              This code expires in 10 minutes. If you didn't create an account, ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

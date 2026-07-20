const PDFDocument = require('pdfkit')
const QRCode      = require('qrcode')

// Streams a landscape A4 "Certificate of Completion" PDF directly to the
// given Express response, complete with a unique certificate ID and a QR
// code that links to the public verification page for it. Pipes straight
// to `res` rather than buffering the whole file in memory.
async function streamCertificate(res, { studentName, courseTitle, instructor, completedAt, score, certificateId }) {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certificateId}`
  const qrDataUrl  = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200, color: { dark: '#111827', light: '#ffffff00' } })

  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${sanitizeFilename(courseTitle)}-certificate.pdf"`)
  doc.pipe(res)

  const { width, height } = doc.page

  // Background + double border
  doc.rect(0, 0, width, height).fill('#faf7ff')
  doc.lineWidth(4).strokeColor('#7c3aed').rect(20, 20, width - 40, height - 40).stroke()
  doc.lineWidth(1).strokeColor('#c4b5fd').rect(32, 32, width - 64, height - 64).stroke()

  doc.font('Helvetica-Bold').fontSize(14).fillColor('#7c3aed')
    .text('L E A R N L Y', 0, 54, { align: 'center', width })

  doc.font('Helvetica-Bold').fontSize(30).fillColor('#111827')
    .text('Certificate of Completion', 0, 90, { align: 'center', width })

  doc.font('Helvetica').fontSize(12).fillColor('#6b7280')
    .text('This certifies that', 0, 150, { align: 'center', width })

  doc.font('Helvetica-Bold').fontSize(26).fillColor('#111827')
    .text(studentName || 'Learnly Student', 0, 174, { align: 'center', width })

  doc.font('Helvetica').fontSize(12).fillColor('#6b7280')
    .text('has successfully completed', 0, 216, { align: 'center', width })

  doc.font('Helvetica-Bold').fontSize(20).fillColor('#7c3aed')
    .text(courseTitle || 'a Learnly course', 60, 242, { align: 'center', width: width - 120 })

  const dateStr = new Date(completedAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const scoreLine = (score !== null && score !== undefined)
    ? `Completed on ${dateStr}   ·   Final mastery: ${score}%`
    : `Completed on ${dateStr}`
  doc.font('Helvetica').fontSize(10).fillColor('#6b7280')
    .text(scoreLine, 0, 288, { align: 'center', width })

  // QR code + certificate ID, bottom-right corner
  const qrSize = 78
  const qrX = width - 64 - qrSize
  const qrY = height - 64 - qrSize
  doc.image(qrDataUrl, qrX, qrY, { width: qrSize, height: qrSize })
  doc.font('Helvetica').fontSize(7).fillColor('#9ca3af')
    .text('Scan to verify', qrX, qrY + qrSize + 4, { width: qrSize, align: 'center' })

  doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
    .text(`Certificate ID: ${certificateId}`, 50, height - 44)

  // Seal
  const sealY = height - 138
  doc.circle(width / 2, sealY, 24).lineWidth(2).strokeColor('#f59e0b').stroke()
  doc.circle(width / 2, sealY, 18).fillColor('#fbbf24').fill()
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#78350f')
    .text('✓', width / 2 - 30, sealY - 8, { width: 60, align: 'center' })

  // Signature lines
  const sigY = height - 82
  const leftX = width / 2 - 260
  const rightX = width / 2 + 40
  const sigWidth = 220

  doc.lineWidth(1).strokeColor('#9ca3af')
    .moveTo(leftX, sigY).lineTo(leftX + sigWidth, sigY).stroke()
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#374151')
    .text(instructor || 'Course Instructor', leftX, sigY + 7, { width: sigWidth, align: 'center' })
  doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
    .text('Instructor', leftX, sigY + 20, { width: sigWidth, align: 'center' })

  doc.moveTo(rightX, sigY).lineTo(rightX + sigWidth, sigY).stroke()
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#374151')
    .text('Learnly Platform', rightX, sigY + 7, { width: sigWidth, align: 'center' })
  doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
    .text('Verified Completion', rightX, sigY + 20, { width: sigWidth, align: 'center' })

  doc.end()
}

function sanitizeFilename(name) {
  return String(name || 'certificate')
    .replace(/[^a-z0-9\- _]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'certificate'
}

module.exports = { streamCertificate }

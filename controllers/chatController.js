const { chatWithTutorAI } = require('../services/aiService')

// POST /api/chat
// body: { message: string, history?: [{ role: 'user'|'assistant', content: string }] }
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'A message is required.' })
    }
    const reply = await chatWithTutorAI(message.trim(), Array.isArray(history) ? history : [])
    res.json({ reply })
  } catch (e) { next(e) }
}

const express   = require('express')
const cors      = require('cors')
const dotenv    = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.use('/api/auth',      require('./routes/authRoutes'))
app.use('/api/courses',   require('./routes/courseRoutes'))
app.use('/api/quiz',      require('./routes/quizRoutes'))
app.use('/api/questions', require('./routes/questionRoutes'))
app.use('/api/badges',    require('./routes/badgeRoutes'))
app.use('/api/instructor', require('./routes/instructorRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))
app.use('/api/chat', require('./routes/chatRoutes'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }))

app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }))

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status ?? 500).json({ message: err.message ?? 'Server error' })
})

console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅  Server → http://localhost:${PORT}`))

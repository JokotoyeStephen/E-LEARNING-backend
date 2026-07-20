const CourseQuestion = require('../models/CourseQuestion')
const Course = require('../models/Course')
const User   = require('../models/User')

// GET /api/courses/:id/questions — visible to any logged-in user (students
// browsing a course benefit from seeing what others already asked).
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await CourseQuestion.find({ course: req.params.id })
      .populate('student', 'name')
      .sort({ createdAt: -1 })

    res.json(questions.map(q => ({
      _id: q._id,
      studentName: q.student?.name || 'Learnly student',
      text: q.text,
      answer: q.answer || null,
      answeredAt: q.answeredAt || null,
      createdAt: q.createdAt,
    })))
  } catch (e) { next(e) }
}

// POST /api/courses/:id/questions — ask a question. Must be enrolled.
exports.askQuestion = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim()
    if (!text) return res.status(400).json({ message: 'Question text is required' })

    const user = await User.findById(req.user._id)
    if (!user.getEnrollment(req.params.id)) {
      return res.status(403).json({ message: 'Enroll in this course before asking a question' })
    }

    const question = await CourseQuestion.create({
      course: req.params.id, student: req.user._id, text: text.slice(0, 1000),
    })
    res.status(201).json(question)
  } catch (e) { next(e) }
}

// POST /api/courses/:id/questions/:questionId/answer — instructor-only,
// and only for their own course.
exports.answerQuestion = async (req, res, next) => {
  try {
    const answer = (req.body.answer || '').trim()
    if (!answer) return res.status(400).json({ message: 'Answer text is required' })

    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    if (req.user.role !== 'admin' && course.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only answer questions on your own courses' })
    }

    const question = await CourseQuestion.findOneAndUpdate(
      { _id: req.params.questionId, course: req.params.id },
      { answer: answer.slice(0, 2000), answeredAt: new Date(), answeredBy: req.user._id },
      { new: true }
    )
    if (!question) return res.status(404).json({ message: 'Question not found' })
    res.json(question)
  } catch (e) { next(e) }
}

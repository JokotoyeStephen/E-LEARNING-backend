const crypto      = require('crypto')
const User        = require('../models/User')
const Course      = require('../models/Course')
const Question    = require('../models/Question')
const QuizAttempt = require('../models/QuizAttempt')
const { generateQuiz }       = require('../services/quizGenerator')
const { generateFeedbackAI } = require('../services/aiService')
const { computeBadges }      = require('../services/badgeService')
const {
  getNextDifficulty, updateCompetenceScore,
  computeTopicBreakdown, updateTopicMastery, getWeakTopics,
} = require('../services/adaptiveEngine')

// GET /api/quiz/generate/:courseId?checkpoint=mid|final
exports.generateQuiz = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const user       = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(req.params.courseId)
    if (!enrollment) return res.status(403).json({ message: 'Enroll in this course first' })

    const checkpoint     = req.query.checkpoint === 'mid' ? 'mid' : 'final'
    const orderedTopics  = [...course.topics].sort((a, b) => a.order - b.order)
    const allTopicNames  = orderedTopics.map(t => t.name)
    const halfCount      = Math.ceil(allTopicNames.length / 2)
    // Which topics must be finished, and which topics the quiz draws from
    const requiredTopics = checkpoint === 'mid' ? allTopicNames.slice(0, halfCount) : allTopicNames
    const quizTopicPool  = checkpoint === 'mid' ? allTopicNames.slice(0, halfCount) : null

    const completed = enrollment.completedTopics || []
    const remaining = requiredTopics.filter(t => !completed.includes(t))
    if (requiredTopics.length > 0 && remaining.length > 0) {
      return res.status(403).json({
        message: checkpoint === 'mid'
          ? 'Finish the first half of the topics before taking the mid-course checkpoint.'
          : 'Finish the lesson content for every topic before taking the final quiz.',
        code: 'LESSONS_INCOMPLETE',
        remainingTopics: remaining,
        checkpoint,
      })
    }

    const prevScore  = enrollment.quizAttempts > 0 ? Math.round(enrollment.competenceScore * 100) : null
    const difficulty = enrollment.currentDifficulty || getNextDifficulty(prevScore)
    const weakTopics = Object.entries(Object.fromEntries(enrollment.topicMastery || []))
      .filter(([,v]) => v < 0.6).map(([t]) => t)

    // The final quiz covers every topic in the course, so it's sized much
    // bigger than the mid-course checkpoint to give a real, thorough
    // assessment of everything taught.
    const totalQuestions = checkpoint === 'mid' ? 15 : 30

    const questions = await generateQuiz(req.params.courseId, difficulty, {
      totalQuestions, weakTopics, topics: quizTopicPool,
    })
    if (!questions.length)
      return res.status(404).json({ message: 'No questions available yet. Ask your instructor to add some.' })

    // Timed quiz: seconds-per-question scales with difficulty, since Hard
    // questions require more reading and reasoning time than Easy ones.
    const secondsPerQuestion = { Easy: 35, Medium: 45, Hard: 60 }[difficulty] || 45
    const timeLimitSeconds = questions.length * secondsPerQuestion

    res.json({
      courseId: req.params.courseId, courseTitle: course.title, difficulty,
      totalQuestions: questions.length, questions, checkpoint, timeLimitSeconds,
    })
  } catch (e) { next(e) }
}

// POST /api/quiz/submit/:courseId
exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers, difficulty } = req.body
    const checkpoint = req.body.checkpoint === 'mid' ? 'mid' : 'final'
    if (!answers) return res.status(400).json({ message: 'Answers required' })

    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const qDocs = await Question.find({ _id: { $in: Object.keys(answers) } }).lean()
    if (!qDocs.length) return res.status(400).json({ message: 'No valid questions' })

    const graded = qDocs.map(q => ({
      question:       q._id,
      topic:          q.topic,
      difficulty:     q.difficulty,
      selectedOption: answers[q._id.toString()] !== undefined ? Number(answers[q._id.toString()]) : null,
      correctAnswer:  q.correctAnswer,
      explanation:    q.explanation || '',
      isCorrect:      Number(answers[q._id.toString()]) === q.correctAnswer,
    }))

    const correctCount   = graded.filter(a => a.isCorrect).length
    const score          = Math.round((correctCount / qDocs.length) * 100)
    const passed         = score >= 70
    const topicBreakdown = computeTopicBreakdown(graded)
    const weakTopics     = getWeakTopics(topicBreakdown)

    // Update enrollment
    const user       = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(req.params.courseId)
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled' })

    // Snapshot badge-relevant state *before* this attempt so we can tell
    // the student which badges they just earned, not just which they have.
    const priorAttempts = await QuizAttempt.find({ student: user._id }).select('score difficulty passed').lean()
    const priorBadges   = computeBadges({
      enrollments: user.enrolledCourses.map(e => e.toObject()), quizAttempts: priorAttempts,
    })
    const priorEarnedIds = new Set(priorBadges.filter(b => b.earned).map(b => b.id))

    const newCompetence  = updateCompetenceScore(enrollment.competenceScore, enrollment.quizAttempts, score)
    const newMastery     = updateTopicMastery(enrollment.topicMastery, topicBreakdown)
    const nextDifficulty = getNextDifficulty(score)

    enrollment.competenceScore   = newCompetence
    enrollment.currentDifficulty = nextDifficulty
    enrollment.quizAttempts     += 1
    enrollment.lastAttemptAt     = new Date()
    enrollment.topicMastery      = newMastery
    let justCompleted = false
    if (checkpoint === 'mid') {
      if (passed) enrollment.midQuizPassed = true
    } else if (passed && !enrollment.completed) {
      enrollment.completed   = true
      enrollment.completedAt = new Date()
      // Mint a unique, publicly-verifiable certificate ID the moment the
      // course is completed — this is what the certificate's QR code and
      // the /verify/:id page key off of.
      enrollment.certificateId = `LNLY-${crypto.randomBytes(5).toString('hex').toUpperCase()}`
      justCompleted = true
    }
    await user.save()

    // AI feedback (with graceful fallback)
    let aiFeedback = fallbackFeedback(score, weakTopics, nextDifficulty)
    try {
      aiFeedback = await generateFeedbackAI({
        studentName: user.name, courseTitle: course.title,
        score, difficulty, topicBreakdown, weakTopics,
      })
    } catch (aiErr) {
      console.warn('AI feedback skipped:', aiErr.message)
    }

    await QuizAttempt.create({
      student: user._id, course: req.params.courseId, difficulty, checkpoint,
      answers: graded, totalQuestions: qDocs.length, correctCount,
      score, passed, topicBreakdown, aiFeedback,
    })

    // Badges just earned by this attempt (course completion, perfect score,
    // hitting 10 attempts, etc.) — computed by diffing against the
    // pre-submit snapshot above.
    const afterBadges = computeBadges({
      enrollments: user.enrolledCourses.map(e => e.toObject()),
      quizAttempts: [...priorAttempts, { score, difficulty, passed }],
    })
    const newBadges = afterBadges.filter(b => b.earned && !priorEarnedIds.has(b.id))

    res.json({
      score, correctCount, totalQuestions: qDocs.length,
      passed, topicBreakdown, weakTopics, nextDifficulty, checkpoint,
      competenceScore: Math.round(newCompetence * 100),
      aiFeedback, newBadges,
      justCompleted, certificateId: justCompleted ? enrollment.certificateId : null,
      answers: graded.map(a => ({
        question: a.question, selectedOption: a.selectedOption,
        correctAnswer: a.correctAnswer, explanation: a.explanation,
        isCorrect: a.isCorrect, topic: a.topic,
      })),
    })
  } catch (e) { next(e) }
}

// GET /api/quiz/history/:courseId
exports.getHistory = async (req, res, next) => {
  try {
    res.json(await QuizAttempt.find({ student: req.user._id, course: req.params.courseId })
      .sort({ completedAt: -1 }).limit(20))
  } catch (e) { next(e) }
}

// GET /api/quiz/progress/:courseId
exports.getProgress = async (req, res, next) => {
  try {
    const user       = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(req.params.courseId)
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled' })

    const attempts = await QuizAttempt.find({ student: req.user._id, course: req.params.courseId }).sort({ completedAt: 1 })
    res.json({
      competenceScore:   Math.round(enrollment.competenceScore * 100),
      currentDifficulty: enrollment.currentDifficulty,
      quizAttempts:      enrollment.quizAttempts,
      completed:         enrollment.completed,
      certificateId:     enrollment.certificateId || null,
      midQuizPassed:     enrollment.midQuizPassed,
      topicMastery:      Object.fromEntries(enrollment.topicMastery || []),
      scoreTrend: attempts.map(a => ({ date: a.completedAt, score: a.score, difficulty: a.difficulty })),
    })
  } catch (e) { next(e) }
}

function fallbackFeedback(score, weakTopics, nextDifficulty) {
  if (score >= 75) return `Great work! You scored ${score}%. You'll face ${nextDifficulty} questions next to keep challenging you.`
  if (score >= 50) return `Good effort — ${score}%.${weakTopics[0] ? ` Focus on reviewing "${weakTopics[0]}".` : ''} Your next quiz will be ${nextDifficulty} difficulty.`
  return `You scored ${score}% — keep going!${weakTopics[0] ? ` Review "${weakTopics[0]}" carefully.` : ''} Your next quiz will be ${nextDifficulty} difficulty.`
}

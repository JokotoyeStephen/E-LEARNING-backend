const Course      = require('../models/Course')
const User        = require('../models/User')
const QuizAttempt = require('../models/QuizAttempt')
const Review      = require('../models/Review')
const CourseQuestion = require('../models/CourseQuestion')

// GET /api/instructor/overview — summary cards across every course this
// instructor owns: distinct students, earnings, completion rate, rating,
// unanswered questions — plus a per-course breakdown for a mini table.
exports.getOverview = async (req, res, next) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id }).select('_id title price')
    if (!courses.length) {
      return res.json({
        totalStudents: 0, totalEnrollments: 0, totalEarnings: 0,
        avgCompletionRate: 0, avgRating: null, totalReviews: 0,
        unansweredQuestions: 0, recentReviews: [], recentQuestions: [], courses: [],
      })
    }
    const courseIds = courses.map(c => c._id)
    const priceById = Object.fromEntries(courses.map(c => [c._id.toString(), c.price || 0]))

    const students = await User.find({ 'enrolledCourses.course': { $in: courseIds } })
      .select('enrolledCourses')

    const perCourse = Object.fromEntries(courses.map(c => [c._id.toString(), {
      _id: c._id, title: c.title, price: c.price || 0, enrollments: 0, completed: 0,
    }]))
    const distinctStudentIds = new Set()
    let totalEnrollments = 0, totalCompleted = 0, totalEarnings = 0

    for (const student of students) {
      for (const e of student.enrolledCourses) {
        const key = e.course?.toString()
        if (!key || !perCourse[key]) continue
        totalEnrollments++
        distinctStudentIds.add(student._id.toString())
        perCourse[key].enrollments++
        totalEarnings += priceById[key] || 0
        if (e.completed) { perCourse[key].completed++; totalCompleted++ }
      }
    }

    const avgCompletionRate = totalEnrollments ? Math.round((totalCompleted / totalEnrollments) * 100) : 0

    const reviews = await Review.find({ course: { $in: courseIds } }).select('rating')
    const avgRating = reviews.length
      ? +(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

    const unansweredQuestions = await CourseQuestion.countDocuments({
      course: { $in: courseIds }, answer: { $exists: false },
    })

    // A handful of the most recent reviews and unanswered questions across
    // *all* of this instructor's courses, so they don't have to click into
    // every course individually to see what needs their attention.
    const courseTitleById = Object.fromEntries(courses.map(c => [c._id.toString(), c.title]))
    const recentReviews = await Review.find({ course: { $in: courseIds } })
      .populate('student', 'name').sort({ createdAt: -1 }).limit(5)
    const recentQuestions = await CourseQuestion.find({ course: { $in: courseIds }, answer: { $exists: false } })
      .populate('student', 'name').sort({ createdAt: -1 }).limit(5)

    res.json({
      totalStudents: distinctStudentIds.size,
      totalEnrollments,
      totalEarnings,
      avgCompletionRate,
      avgRating,
      totalReviews: reviews.length,
      unansweredQuestions,
      recentReviews: recentReviews.map(r => ({
        _id: r._id, courseId: r.course, courseTitle: courseTitleById[r.course.toString()],
        studentName: r.student?.name || 'Learnly student', rating: r.rating,
        comment: r.comment || '', createdAt: r.createdAt,
      })),
      recentQuestions: recentQuestions.map(q => ({
        _id: q._id, courseId: q.course, courseTitle: courseTitleById[q.course.toString()],
        studentName: q.student?.name || 'Learnly student', text: q.text, createdAt: q.createdAt,
      })),
      courses: Object.values(perCourse).map(c => ({
        ...c,
        completionRate: c.enrollments ? Math.round((c.completed / c.enrollments) * 100) : 0,
        earnings: c.enrollments * c.price,
      })),
    })
  } catch (e) { next(e) }
}

// GET /api/instructor/courses/:id/analytics — full drill-down for one course.
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    if (req.user.role !== 'admin' && course.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your course' })
    }

    // Positional $ projection pulls back just each student's matching
    // enrollment subdocument for *this* course, not their whole array.
    const students = await User.find(
      { 'enrolledCourses.course': course._id },
      'name email enrolledCourses.$'
    )

    const enrollments = students
      .map(u => {
        const e = u.enrolledCourses[0]
        return {
          studentId: u._id, name: u.name, email: u.email,
          enrolledAt: e.enrolledAt, completed: e.completed, completedAt: e.completedAt || null,
          competenceScore: Math.round((e.competenceScore ?? 0) * 100),
          quizAttempts: e.quizAttempts, currentDifficulty: e.currentDifficulty,
        }
      })
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))

    const totalEnrollments = enrollments.length
    const completedCount   = enrollments.filter(e => e.completed).length
    const completionRate   = totalEnrollments ? Math.round((completedCount / totalEnrollments) * 100) : 0
    const earnings          = totalEnrollments * (course.price || 0)

    // Quiz statistics
    const attempts = await QuizAttempt.find({ course: course._id })
      .select('score passed difficulty checkpoint').lean()
    const totalAttempts = attempts.length
    const avgScore = totalAttempts ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0
    const passRate = totalAttempts ? Math.round((attempts.filter(a => a.passed).length / totalAttempts) * 100) : 0
    const byDifficulty = ['Easy', 'Medium', 'Hard'].map(difficulty => {
      const subset = attempts.filter(a => a.difficulty === difficulty)
      return {
        difficulty, attempts: subset.length,
        avgScore: subset.length ? Math.round(subset.reduce((s, a) => s + a.score, 0) / subset.length) : 0,
        passRate: subset.length ? Math.round((subset.filter(a => a.passed).length / subset.length) * 100) : 0,
      }
    })
    const finalAttempts = attempts.filter(a => a.checkpoint === 'final')

    // Reviews
    const reviews = await Review.find({ course: course._id }).populate('student', 'name').sort({ createdAt: -1 })
    const avgRating = reviews.length
      ? +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null

    // Questions
    const questions = await CourseQuestion.find({ course: course._id }).populate('student', 'name').sort({ createdAt: -1 })

    res.json({
      courseId: course._id, courseTitle: course.title, price: course.price || 0,
      totalEnrollments, completedCount, completionRate, earnings,
      quizStats: {
        totalAttempts, avgScore, passRate, byDifficulty,
        finalQuizAttempts: finalAttempts.length,
        finalQuizPassRate: finalAttempts.length
          ? Math.round((finalAttempts.filter(a => a.passed).length / finalAttempts.length) * 100) : 0,
      },
      avgRating, totalReviews: reviews.length,
      reviews: reviews.map(r => ({
        _id: r._id, studentName: r.student?.name || 'Learnly student',
        rating: r.rating, comment: r.comment || '', createdAt: r.createdAt,
      })),
      questions: questions.map(q => ({
        _id: q._id, studentName: q.student?.name || 'Learnly student',
        text: q.text, answer: q.answer || null, answeredAt: q.answeredAt || null, createdAt: q.createdAt,
      })),
      unansweredCount: questions.filter(q => !q.answer).length,
      enrollments,
    })
  } catch (e) { next(e) }
}

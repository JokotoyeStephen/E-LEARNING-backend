const Course = require('../models/Course')
const User   = require('../models/User')
const { streamCertificate } = require('../services/certificateService')

exports.getCourses = async (req, res, next) => {
  try {
    const { search, category } = req.query
    const filter = { isPublished: true }
    if (category) filter.category = category
    if (search)   filter.$text = { $search: search }
    res.json(await Course.find(filter).sort({ createdAt: -1 }))
  } catch (e) { next(e) }
}

exports.getEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses.course')
    res.json(
      user.enrolledCourses.filter(e => e.course).map(e => ({
        ...e.course.toObject(),
        enrolledAt:        e.enrolledAt,
        completed:         e.completed,
        certificateId:     e.certificateId || null,
        competenceScore:   e.competenceScore,
        currentDifficulty: e.currentDifficulty,
        quizAttempts:      e.quizAttempts,
        topicMastery:      Object.fromEntries(e.topicMastery || []),
        completedTopics:   e.completedTopics || [],
      }))
    )
  } catch (e) { next(e) }
}

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    const user       = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(course._id)
    res.json({
      ...course.toObject(),
      isEnrolled:        !!enrollment,
      currentDifficulty: enrollment?.currentDifficulty ?? null,
      competenceScore:   enrollment?.competenceScore   ?? null,
      topicMastery:      enrollment ? Object.fromEntries(enrollment.topicMastery || []) : null,
      completedTopics:   enrollment?.completedTopics ?? [],
      midQuizPassed:     enrollment?.midQuizPassed ?? false,
      completed:         enrollment?.completed ?? false,
      certificateId:     enrollment?.certificateId ?? null,
    })
  } catch (e) { next(e) }
}

exports.completeTopic = async (req, res, next) => {
  try {
    const { id, topicName } = req.params

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    if (!course.topics.some(topic => topic.name === topicName)) {
      return res.status(404).json({
        message: 'Topic not found on this course',
      })
    }

    const user = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(course._id)

    if (!enrollment) {
      return res.status(400).json({
        message: 'Not enrolled in this course',
      })
    }

    if (!enrollment.completedTopics.includes(topicName)) {
      // Mark the topic as completed
      enrollment.completedTopics.push(topicName)

      // Save completion history for analytics
      user.topicCompletionLog.push({
        course: course._id,
        topic: topicName,
        completedAt: new Date(),
      })

      await user.save()
    }

    res.json({
      completedTopics: enrollment.completedTopics,
    })
  } catch (e) {
    next(e)
  }
}

exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    const user = await User.findById(req.user._id)
    if (user.getEnrollment(course._id)) return res.status(400).json({ message: 'Already enrolled' })
    user.enrolledCourses.push({ course: course._id })
    await user.save()
    res.json({ message: 'Enrolled successfully' })
  } catch (e) { next(e) }
}

exports.createCourse = async (req, res, next) => {
  try { res.status(201).json(await Course.create({ ...req.body, createdBy: req.user._id })) }
  catch (e) { next(e) }
}

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!course) return res.status(404).json({ message: 'Course not found' })
    res.json(course)
  } catch (e) { next(e) }
}

exports.deleteCourse = async (req, res, next) => {
  try {
    if (!await Course.findByIdAndDelete(req.params.id)) return res.status(404).json({ message: 'Course not found' })
    res.json({ message: 'Course deleted' })
  } catch (e) { next(e) }
}

exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json(courses)
  } catch (e) { next(e) }
}

// GET /api/courses/:id/certificate — streams a PDF, only for a student who
// has actually completed the course.
exports.getCertificate = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const user       = await User.findById(req.user._id)
    const enrollment = user.getEnrollment(course._id)
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this course' })
    if (!enrollment.completed) {
      return res.status(403).json({ message: 'Complete the course to unlock your certificate' })
    }

    await streamCertificate(res, {
      studentName:   user.name,
      courseTitle:   course.title,
      instructor:    course.instructor,
      completedAt:   enrollment.completedAt,
      score:         Math.round((enrollment.competenceScore ?? 0) * 100),
      certificateId: enrollment.certificateId,
    })
  } catch (e) { next(e) }
}

// GET /api/courses/certificates/verify/:certificateId — public, no auth.
// Lets anyone (e.g. an employer scanning the QR code) confirm a certificate
// is real without needing to log in.
exports.verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params
    const user = await User.findOne({ 'enrolledCourses.certificateId': certificateId })
      .populate('enrolledCourses.course', 'title instructor')
    if (!user) return res.status(404).json({ valid: false, message: 'Certificate not found' })

    const enrollment = user.enrolledCourses.find(e => e.certificateId === certificateId)
    if (!enrollment?.course) return res.status(404).json({ valid: false, message: 'Certificate not found' })

    res.json({
      valid: true,
      certificateId,
      studentName: user.name,
      courseTitle: enrollment.course.title,
      instructor:  enrollment.course.instructor,
      completedAt: enrollment.completedAt,
      score:       Math.round((enrollment.competenceScore ?? 0) * 100),
    })
  } catch (e) { next(e) }
}

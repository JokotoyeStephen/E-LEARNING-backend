const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },

  enrolledAt: {
    type: Date,
    default: Date.now,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
  },

  // Generated when the student successfully completes the course
  // Used for certificate verification and QR codes.
  certificateId: {
    type: String,
  },

  // Bayesian competence estimate (0–1)
  competenceScore: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1,
  },

  // Adaptive learning difficulty
  currentDifficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },

  // Quiz statistics
  quizAttempts: {
    type: Number,
    default: 0,
  },

  lastAttemptAt: {
    type: Date,
  },

  // Mid-course assessment
  midQuizPassed: {
    type: Boolean,
    default: false,
  },

  // Topic name → mastery score (0–1)
  topicMastery: {
    type: Map,
    of: Number,
    default: {},
  },

  // Topics the learner has completed
  completedTopics: [{
    type: String,
  }],
})

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },

    enrolledCourses: [enrollmentSchema],

    // Analytics log of every completed topic
    topicCompletionLog: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },

        topic: {
          type: String,
        },

        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Email verification status
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.$locals.skipPasswordHash) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare entered password with stored password
userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

// Get a user's enrollment for a specific course
userSchema.methods.getEnrollment = function (courseId) {
  return this.enrolledCourses.find(
    enrollment => enrollment.course.toString() === courseId.toString()
  )
}

module.exports = mongoose.model('User', userSchema)
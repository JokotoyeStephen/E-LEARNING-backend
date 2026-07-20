const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  prerequisites: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },

  // Lesson content
  lesson: {
    // Introduction
    intro: {
      type: String,
    },

    // Main learning points
    keyPoints: [{
      type: String,
    }],

    // More detailed explanations
    deepDive: [{
      type: String,
    }],

    // Real-world applications
    applications: [{
      type: String,
    }],

    // Common mistakes learners make
    commonMistakes: [{
      type: String,
    }],

    // Example
    example: {
      type: String,
    },

    // Lesson summary
    summary: {
      type: String,
    },

    // Optional YouTube video
    videoUrl: {
      type: String,
    },

    // Downloadable lesson resources
    resources: [{
      title: {
        type: String,
      },
      url: {
        type: String,
      },
    }],

    // Video timestamps (in seconds)
    highlights: [{
      label: {
        type: String,
      },
      time: {
        type: Number,
      },
    }],

    // Optional code playground
    codePlayground: {
      language: {
        type: String, // javascript, python, java, etc.
      },
      starterCode: {
        type: String,
      },
    },
  },
})

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    instructor: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
    },

    thumbnail: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },

    price: {
      type: Number,
      default: 0,
    },

    tag: {
      type: String,
      enum: ['Bestseller', 'Popular', 'New', null],
    },

    duration: {
      type: String,
    },

    syllabus: [{
      type: String,
    }],

    topics: [topicSchema],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// Enable text search
courseSchema.index({
  title: 'text',
  instructor: 'text',
  description: 'text',
})

module.exports = mongoose.model('Course', courseSchema)
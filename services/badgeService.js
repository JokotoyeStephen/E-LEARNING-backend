// Badges are computed on the fly from data that already exists (enrollments
// + quiz attempts) rather than stored separately — so there's nothing to
// migrate or get out of sync. `computeBadges` is called both by the
// dedicated /api/badges endpoint and by quizController right after a quiz
// submit, so the UI can show "you just earned a new badge" toasts.

const BADGE_CATALOG = [
  {
    id: 'getting-started', title: 'Getting Started', icon: '🚀',
    description: 'Enroll in your first course.',
    check: ({ enrollments }) => enrollments.length >= 1,
  },
  {
    id: 'course-graduate', title: 'Course Graduate', icon: '🎓',
    description: 'Complete your first course.',
    check: ({ enrollments }) => enrollments.some(e => e.completed),
  },
  {
    id: 'triple-threat', title: 'Triple Threat', icon: '🏆',
    description: 'Complete 3 or more courses.',
    check: ({ enrollments }) => enrollments.filter(e => e.completed).length >= 3,
  },
  {
    id: 'perfectionist', title: 'Perfectionist', icon: '💯',
    description: 'Score 100% on any quiz.',
    check: ({ quizAttempts }) => quizAttempts.some(a => a.score === 100),
  },
  {
    id: 'halfway-hero', title: 'Halfway Hero', icon: '🥇',
    description: 'Pass a mid-course checkpoint quiz.',
    check: ({ enrollments }) => enrollments.some(e => e.midQuizPassed),
  },
  {
    id: 'hard-mode-hero', title: 'Hard Mode Hero', icon: '🔥',
    description: 'Pass a quiz at Hard difficulty.',
    check: ({ quizAttempts }) => quizAttempts.some(a => a.difficulty === 'Hard' && a.passed),
  },
  {
    id: 'quiz-marathon', title: 'Quiz Marathon', icon: '🏃',
    description: 'Complete 10 or more quiz attempts.',
    check: ({ quizAttempts }) => quizAttempts.length >= 10,
  },
  {
    id: 'high-achiever', title: 'High Achiever', icon: '⭐',
    description: 'Reach 85% mastery in any course.',
    check: ({ enrollments }) => enrollments.some(e => (e.competenceScore ?? 0) >= 0.85),
  },
  {
    id: 'fast-learner', title: 'Fast Learner', icon: '⚡',
    description: 'Complete a course within 7 days of enrolling.',
    check: ({ enrollments }) => enrollments.some(e =>
      e.completed && e.completedAt && e.enrolledAt &&
      (new Date(e.completedAt) - new Date(e.enrolledAt)) <= 7 * 24 * 60 * 60 * 1000),
  },
]

// enrollments: array of enrollment subdocs/plain objects
// quizAttempts: array of { score, difficulty, passed }
function computeBadges({ enrollments = [], quizAttempts = [] }) {
  return BADGE_CATALOG.map(b => ({
    id: b.id, title: b.title, icon: b.icon, description: b.description,
    earned: Boolean(b.check({ enrollments, quizAttempts })),
  }))
}

module.exports = { BADGE_CATALOG, computeBadges }

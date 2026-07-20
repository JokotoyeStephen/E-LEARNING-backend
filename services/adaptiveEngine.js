/**
 * Adaptive Engine — implements section 3.3.2 of the project spec.
 *
 * Difficulty rules:
 *   score < 50  → Easy
 *   50 ≤ score < 75 → Medium
 *   score ≥ 75  → Hard
 */

function getNextDifficulty(score) {
  if (score === null || score === undefined) return 'Medium'
  if (score < 50)  return 'Easy'
  if (score < 75)  return 'Medium'
  return 'Hard'
}

/**
 * Bayesian-inspired competence update.
 * Weights history by attempt count (capped at 5) so early attempts
 * influence less as the student builds a track record.
 */
function updateCompetenceScore(current, attemptCount, newScorePct) {
  const w = Math.min(attemptCount, 5)
  return parseFloat(((current * w + newScorePct / 100) / (w + 1)).toFixed(4))
}

/** Per-topic accuracy from graded answers array */
function computeTopicBreakdown(answers) {
  const map = {}
  for (const a of answers) {
    if (!map[a.topic]) map[a.topic] = { correct: 0, total: 0, accuracy: 0 }
    map[a.topic].total++
    if (a.isCorrect) map[a.topic].correct++
  }
  for (const t of Object.keys(map)) {
    map[t].accuracy = Math.round((map[t].correct / map[t].total) * 100)
  }
  return map
}

/** Exponential moving average merge of new topic results into stored mastery */
function updateTopicMastery(existing, newBreakdown) {
  const updated = { ...Object.fromEntries(existing || []) }
  for (const [topic, stats] of Object.entries(newBreakdown)) {
    const prev = updated[topic] ?? 0.5
    updated[topic] = parseFloat((prev * 0.7 + (stats.accuracy / 100) * 0.3).toFixed(4))
  }
  return updated
}

/** Topics where accuracy < threshold need remediation */
function getWeakTopics(breakdown, threshold = 60) {
  return Object.entries(breakdown)
    .filter(([, s]) => s.accuracy < threshold)
    .map(([t]) => t)
}

module.exports = { getNextDifficulty, updateCompetenceScore, computeTopicBreakdown, updateTopicMastery, getWeakTopics }

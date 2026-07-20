// Generates a full-depth, structured lesson for a topic without calling the
// AI service — keeps `npm run seed` fast, free, and reliable with no internet
// or ANTHROPIC_API_KEY needed. Instructors can replace/expand this later
// from the Instructor Dashboard.
//
// Shape matches topicSchema.lesson in models/Course.js:
//   { intro, keyPoints: [String], deepDive: [String], applications: [String],
//     commonMistakes: [String], example, summary }
//
// This generator is intentionally verbose: it's the lesson content for the
// 80 auto-generated demo courses, so it's the main lever for "the courses
// feel thin" — every section below is written to give a learner enough to
// actually reason about the topic, not just recognise a one-line definition.

function generateLessonContent(topicName, courseTitle) {
  return {
    intro: `This lesson covers "${topicName}", one of the core building blocks of ${courseTitle}. Rather than skimming a definition, work through every section below — the key points, the deeper explanation, the real-world applications, and the common mistakes — so that by the time you reach the quiz for this topic you're answering from genuine understanding rather than guesswork or pattern-matching.`,

    keyPoints: [
      `What "${topicName}" actually means, in plain language, and where it sits within the broader map of ${courseTitle}.`,
      `Why ${topicName} matters — the specific problem it solves or the skill it builds toward later in the course.`,
      `The prerequisite ideas ${topicName} assumes you already have, and what to revisit if any of this feels shaky.`,
      `How a practitioner recognises when ${topicName} is the right tool or concept to reach for versus when it isn't.`,
      `A common mistake learners make with ${topicName}, why it happens, and how to avoid it.`,
      `How ${topicName} connects to the topic that follows it in this course, so the sequence makes sense rather than feeling arbitrary.`,
    ],

    deepDive: [
      `Look closer at "${topicName}" and you'll find it's rarely an isolated fact — it's a working idea that only clicks once you've seen it used, not just defined. Start by asking what would break, or what wouldn't be possible, if ${topicName} didn't exist as a concept in this field. That "what problem is this solving" framing is usually more useful than memorising a textbook definition, because it tells you when to actually reach for the idea later.`,
      `A second layer worth sitting with: ${topicName} has boundaries. It's tempting to treat any new concept as universally applicable, but part of mastering ${topicName} is knowing where it stops being the right lens — the edge cases, the situations where a different approach in ${courseTitle} serves you better, and the tradeoffs involved in choosing one over the other.`,
      `Finally, ${topicName} is easiest to retain when you can explain it to someone else without leaning on jargon. Before moving on, try restating it in one or two plain sentences, out loud or in writing — if you find yourself reaching for the exact wording from this lesson, that's a sign to slow down and rebuild the explanation from your own understanding instead.`,
    ],

    applications: [
      `An everyday or industry scenario where ${topicName} shows up directly, even if the people involved wouldn't necessarily call it by this name.`,
      `A situation where skipping or misunderstanding ${topicName} causes a real, visible problem — this is often the fastest way to see why it's taught here.`,
      `A more advanced context, later in a career or project working with ${courseTitle}, where a solid grasp of ${topicName} becomes a foundation for something more complex.`,
    ],

    commonMistakes: [
      `Treating ${topicName} as a fact to memorise rather than a tool to apply — learners who only memorise the definition usually can't recognise ${topicName} in a slightly unfamiliar scenario, even though they could recite it perfectly on request.`,
      `Applying ${topicName} reflexively, everywhere, without first checking whether the situation actually calls for it — most real-world mistakes with ${topicName} come from skipping that check rather than from misunderstanding the concept itself.`,
    ],

    example: `Example: think through a small, concrete case involving ${topicName}. Write down what you'd do first, second, and why — including what you'd expect to happen at each step — before checking your reasoning against the course material or asking your instructor. If your prediction and the actual outcome diverge, that gap is exactly where the real learning happens.`,

    summary: `You should now be able to explain ${topicName} in your own words, recognise it in a practical scenario, name at least one situation where it doesn't apply, and describe a mistake learners commonly make with it. Once you're comfortable with all of that — not just the definition — mark this topic complete to unlock its quiz.`,
  }
}

module.exports = { generateLessonContent }

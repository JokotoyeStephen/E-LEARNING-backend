// Generates plausible, varied MCQ practice questions for a topic without
// calling the AI service — keeps `npm run seed` fast, free, and reliable even
// with no internet connection or ANTHROPIC_API_KEY set.
//
// Real instructors can still use the existing "Generate with AI" tool
// (POST /api/questions/generate) from the Instructor Dashboard to add
// higher-quality, topic-specific questions on top of these at any time.

const EASY_TEMPLATES = [
  {
    text: t => `Which of the following best defines "${t}"?`,
    build: t => ({
      options: [
        `A core concept directly related to ${t}`,
        `An unrelated concept from a different field`,
        `A tool used only for documentation`,
        `A deprecated technique no longer taught`,
      ],
      correctAnswer: 0,
      explanation: `${t} is a foundational concept in this topic area — understanding its core definition is the first step before moving to applied questions.`,
    }),
  },
  {
    text: t => `Why is understanding "${t}" important in this course?`,
    build: t => ({
      options: [
        `It has no real impact on the rest of the course`,
        `It builds the foundation needed for later, more advanced topics`,
        `It is only relevant to advanced learners`,
        `It was included only as an optional aside`,
      ],
      correctAnswer: 1,
      explanation: `Topics are sequenced so each one builds toward the next — ${t} lays groundwork that later lessons depend on.`,
    }),
  },
  {
    text: t => `A beginner is asked to describe "${t}" in one sentence. Which description is most accurate?`,
    build: t => ({
      options: [
        `A precise, working description that captures what ${t} actually does`,
        `A vague statement that could describe almost any topic`,
        `A description borrowed from a completely different subject`,
        `A description that focuses only on unrelated trivia`,
      ],
      correctAnswer: 0,
      explanation: `A good beginner-level description of ${t} is specific enough to distinguish it from other ideas in the course, not just a generic statement.`,
    }),
  },
  {
    text: t => `Which of these is a prerequisite mindset for learning "${t}" effectively?`,
    build: t => ({
      options: [
        `Skipping the fundamentals and jumping straight to edge cases`,
        `Approaching it with curiosity about the problem it solves, not just its definition`,
        `Memorising the exact wording of a textbook definition`,
        `Avoiding any practical examples until the whole course is finished`,
      ],
      correctAnswer: 1,
      explanation: `${t} is best learned by understanding the problem it addresses first — the definition sticks much better once the "why" is clear.`,
    }),
  },
  {
    text: t => `Where does "${t}" typically fit in a learner's overall progress through this course?`,
    build: t => ({
      options: [
        `As an isolated fact with no connection to other topics`,
        `As a building block that connects to and supports later topics`,
        `As something only relevant after the course ends`,
        `As a topic that contradicts everything taught before it`,
      ],
      correctAnswer: 1,
      explanation: `Courses are sequenced deliberately — ${t} is placed here specifically because later topics build on it.`,
    }),
  },
]

const MEDIUM_TEMPLATES = [
  {
    text: t => `In a practical scenario, how would you correctly apply "${t}"?`,
    build: t => ({
      options: [
        `By ignoring context and applying it uniformly everywhere`,
        `By identifying when it fits the situation, then applying it deliberately`,
        `By applying it only when explicitly instructed step-by-step`,
        `By replacing it entirely with unrelated techniques`,
      ],
      correctAnswer: 1,
      explanation: `Applying ${t} well means recognizing the right context for it, not applying it mechanically or skipping it altogether.`,
    }),
  },
  {
    text: t => `What is a common mistake learners make when working with "${t}"?`,
    build: t => ({
      options: [
        `Spending too much time understanding the fundamentals first`,
        `Misapplying it without checking whether it actually fits the situation`,
        `Reviewing it more than once`,
        `Asking for clarification when confused`,
      ],
      correctAnswer: 1,
      explanation: `A frequent pitfall with ${t} is applying it reflexively rather than confirming it's actually the right fit for the problem at hand.`,
    }),
  },
  {
    text: t => `Two learners disagree about when "${t}" should be used. What's the best way to resolve it?`,
    build: t => ({
      options: [
        `Whoever argues more confidently is right`,
        `Trace the disagreement back to the specific problem ${t} is meant to solve, and test it against that`,
        `Avoid using ${t} entirely to sidestep the disagreement`,
        `Flip a coin, since both views are equally valid regardless of context`,
      ],
      correctAnswer: 1,
      explanation: `Disagreements about ${t} are usually resolved by returning to first principles — what problem it solves — rather than by authority or convenience.`,
    }),
  },
  {
    text: t => `Which scenario shows a correct, context-aware application of "${t}"?`,
    build: t => ({
      options: [
        `Applying ${t} without first checking whether the underlying assumptions hold`,
        `Checking that the situation matches what ${t} is designed for, then applying it deliberately`,
        `Applying ${t} because it was the most recent topic covered`,
        `Avoiding ${t} because it seems complicated at first glance`,
      ],
      correctAnswer: 1,
      explanation: `Context-aware application of ${t} means verifying the assumptions behind it hold before relying on it.`,
    }),
  },
  {
    text: t => `How does "${t}" typically interact with the topics that come immediately before and after it in this course?`,
    build: t => ({
      options: [
        `It has no meaningful relationship with neighbouring topics`,
        `It builds on what came before and sets up what comes next`,
        `It contradicts and replaces the topic before it entirely`,
        `It is only relevant in isolation, never combined with other ideas`,
      ],
      correctAnswer: 1,
      explanation: `${t} is sequenced deliberately — it depends on earlier ideas and feeds directly into what's taught next.`,
    }),
  },
]

const HARD_TEMPLATES = [
  {
    text: t => `Which statement most accurately captures a nuanced tradeoff involved in "${t}"?`,
    build: t => ({
      options: [
        `There are no tradeoffs — it is universally optimal`,
        `Its benefits typically come with a specific, context-dependent cost that must be weighed`,
        `It is only theoretical and has no practical tradeoffs`,
        `The tradeoffs only matter for beginners`,
      ],
      correctAnswer: 1,
      explanation: `Advanced understanding of ${t} means recognizing that its advantages come with real tradeoffs depending on context — rarely is anything a free win.`,
    }),
  },
  {
    text: t => `An expert is asked to critique a flawed application of "${t}". What should they check first?`,
    build: t => ({
      options: [
        `Whether the underlying assumptions and context actually justified using it`,
        `Whether it was applied quickly enough`,
        `Whether it was documented in enough detail`,
        `Whether a majority of people also use it that way`,
      ],
      correctAnswer: 0,
      explanation: `Expert-level critique of ${t} starts by questioning whether the foundational assumptions held — most flawed applications trace back to a mismatched context.`,
    }),
  },
  {
    text: t => `Under what condition would an experienced practitioner deliberately choose NOT to use "${t}"?`,
    build: t => ({
      options: [
        `Never — ${t} should always be used regardless of context`,
        `When the specific costs or assumptions of ${t} don't hold for the situation at hand`,
        `Only when instructed to do so by someone less experienced`,
        `Only on the first attempt at a problem, never afterward`,
      ],
      correctAnswer: 1,
      explanation: `Knowing when NOT to use ${t} is as much a sign of mastery as knowing how to use it — expertise includes recognizing its limits.`,
    }),
  },
  {
    text: t => `Which follow-up question best tests whether someone truly understands "${t}" at an advanced level?`,
    build: t => ({
      options: [
        `"Can you recite the definition of ${t} word for word?"`,
        `"Can you describe a case where ${t} would fail or mislead someone, and why?"`,
        `"Can you name ${t} as quickly as possible?"`,
        `"Can you avoid mentioning ${t} entirely?"`,
      ],
      correctAnswer: 1,
      explanation: `True mastery of ${t} shows up in being able to describe its failure modes and limits, not just its textbook definition.`,
    }),
  },
  {
    text: t => `When comparing "${t}" to an alternative approach covered elsewhere in this course, what's the most rigorous basis for choosing between them?`,
    build: t => ({
      options: [
        `Whichever one was taught most recently`,
        `The specific constraints of the problem — cost, context, and assumptions — not general popularity`,
        `Whichever approach requires less explanation`,
        `Personal preference alone, since both are always interchangeable`,
      ],
      correctAnswer: 1,
      explanation: `Rigorous decisions about ${t} versus alternatives come down to the actual constraints of the problem, not convenience or familiarity.`,
    }),
  },
]

function pick(arr, seed) {
  return arr[seed % arr.length]
}

/**
 * Generates `count` MCQ questions for a topic at a given difficulty.
 * Deterministic-ish variety via template rotation + a running seed so
 * questions for the same topic don't repeat within a course. With 5
 * templates per difficulty, up to 5 questions per topic/difficulty come
 * out fully distinct before any rotation repeats.
 */
function generateTemplateQuestions(courseId, topic, difficulty, count = 3) {
  const bank = difficulty === 'Easy' ? EASY_TEMPLATES : difficulty === 'Hard' ? HARD_TEMPLATES : MEDIUM_TEMPLATES
  const questions = []
  for (let i = 0; i < count; i++) {
    const template = pick(bank, i)
    const built = template.build(topic)
    questions.push({
      course: courseId,
      topic,
      difficulty,
      type: 'mcq',
      source: 'manual',
      text: template.text(topic),
      options: built.options,
      correctAnswer: built.correctAnswer,
      explanation: built.explanation,
    })
  }
  return questions
}

module.exports = { generateTemplateQuestions }

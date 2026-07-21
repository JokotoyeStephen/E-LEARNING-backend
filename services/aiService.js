const axios = require("axios")

const GROQ_MODEL = "llama-3.3-70b-versatile"

async function callGroq(prompt, maxTokens = 1500) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return response.data.choices[0].message.content
  } catch (err) {
    console.error(
      "Groq API Error:",
      err.response?.data || err.message
    )
    throw err
  }
}

/**
 * Generate quiz questions
 */
async function generateQuestionsAI(
  courseTitle,
  topic,
  difficulty,
  count = 5,
  courseId
) {
  const guide = {
    Easy: "basic recall and definitions",
    Medium: "application and understanding",
    Hard: "critical thinking and analysis",
  }

  const prompt = `
You are an expert educational assessment designer.

Generate exactly ${count} multiple-choice questions.

Course:
${courseTitle}

Topic:
${topic}

Difficulty:
${difficulty}

Difficulty description:
${guide[difficulty]}

Rules:

- Exactly 4 options.
- Exactly one correct answer.
- Include explanation.
- Return ONLY valid JSON.

Example:

[
 {
   "text":"Question?",
   "options":["A","B","C","D"],
   "correctAnswer":0,
   "explanation":"Reason"
 }
]
`

  const raw = await callGroq(prompt, 2000)

  let questions

  try {
    questions = JSON.parse(
      raw.replace(/```json/g, "").replace(/```/g, "").trim()
    )
  } catch (err) {
    console.log(raw)
    throw new Error("Groq returned invalid JSON.")
  }

  return questions.map((q) => ({
    course: courseId,
    topic,
    difficulty,
    type: "mcq",
    source: "ai",

    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }))
}

/**
 * Personalized quiz feedback
 */
async function generateFeedbackAI({
  studentName,
  courseTitle,
  score,
  difficulty,
  topicBreakdown,
  weakTopics,
}) {
  const topicSummary = Object.entries(topicBreakdown)
    .map(
      ([topic, stats]) =>
        `${topic}: ${stats.correct}/${stats.total} (${stats.accuracy}%)`
    )
    .join("\n")

  const prompt = `
You are an encouraging learning coach.

Student:
${studentName}

Course:
${courseTitle}

Difficulty:
${difficulty}

Score:
${score}%

Topic Results:

${topicSummary}

Weak Topics:
${weakTopics.join(", ") || "None"}

Write 3-4 encouraging sentences.

Mention:

- congratulate them
- strongest topic
- weakest topic
- one improvement suggestion
- motivate them

Plain text only.
`

  return await callGroq(prompt, 500)
}

/**
 * Learnly AI Tutor
 */
async function chatWithTutorAI(message, history = []) {
  const historyText = history
    .slice(-6)
    .map(
      (m) =>
        `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`
    )
    .join("\n")

  const prompt = `
You are Learnly Assistant.

You help students with:

- programming
- web development
- databases
- networking
- operating systems
- mathematics
- quizzes
- certificates
- roadmap
- study advice
- motivation

Do not invent scores or progress.

Keep answers short.

${historyText}

Student:
${message}

Tutor:
`

  return await callGroq(prompt, 500)
}

module.exports = {
  generateQuestionsAI,
  generateFeedbackAI,
  chatWithTutorAI,
}
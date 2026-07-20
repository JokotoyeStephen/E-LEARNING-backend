const axios = require('axios')

const GEMINI_MODEL = 'gemini-2.5-pro'

/**
 * Generic Gemini request
 */
async function callGemini(prompt, maxTokens = 1500) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    )
  } catch (err) {
    console.error(
      "Gemini API Error:",
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

- Exactly 4 options
- Exactly one correct answer
- Include explanation
- Return ONLY JSON

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

  const raw = await callGemini(prompt, 2000)

  let questions

  try {
    questions = JSON.parse(
      raw.replace(/```json/g, "").replace(/```/g, "").trim()
    )
  } catch (e) {
    console.log(raw)
    throw new Error("Gemini returned invalid JSON.")
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
 * Personalized feedback
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

Topic results:

${topicSummary}

Weak topics:
${weakTopics.join(", ") || "None"}

Write 3-4 sentences.

Mention:

- congratulate them
- strongest topic
- weakest topic
- one improvement suggestion
- motivate them

Plain text only.
`

  return await callGemini(prompt, 500)
}

/**
 * Learnly AI Chatbot
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

- learning
- quizzes
- certificates
- badges
- roadmap
- study advice
- motivation

Never invent student scores.

Keep replies between 2 and 4 sentences.

${historyText}

Student:
${message}

Tutor:
`

  return await callGemini(prompt, 500)
}

module.exports = {
  generateQuestionsAI,
  generateFeedbackAI,
  chatWithTutorAI,
}
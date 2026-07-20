const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;

require('dotenv').config()

console.log(process.env.GEMINI_API_KEY)

async function main() {
  try {
    const res = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    console.log(res.data.models.map(m => m.name));
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

main();
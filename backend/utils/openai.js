// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash-latest", // 👈 change here
// });

// export const generateInterviewQuestions = async (category, difficulty) => {
//   try {
//     const prompt = `
// You are a professional technical interviewer.

// Generate exactly 5 interview questions.

// Category: ${category}
// Difficulty: ${difficulty}

// Rules:
// - No answers
// - No explanations
// - Output ONLY valid JSON

// {
//   "questions": [
//     "question 1",
//     "question 2",
//     "question 3",
//     "question 4",
//     "question 5"
//   ]
// }
// `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return JSON.parse(text).questions;

//   } catch (err) {
//     console.error("Gemini Error:", err);
//     return null;
//   }
// };

import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config();

const cohere = new CohereClient({
  token: process.env.API,
});

export const generateInterviewQuestions = async ({ category, difficulty }) => {
  console.log("Generating questions for category:", category, "difficulty:", difficulty);
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: `
Return ONLY a valid JSON array. you are a tech interviewer generate such types of questions so that student feels like real tech interviews, question shiuld be match like asked in real online interviews.

Rules:
- Exactly 5 interview questions
- No numbering
- No answers
- No explanations
- No markdown
- No extra text

Schema:
[
  { "question": "string" }
]

Category: ${category}
Difficulty: ${difficulty}
      `,
      temperature: 0.2,
      max_tokens: 800,
    });

    // Cohere ALWAYS returns text
    const rawText = response.text.trim();

    // Extract only JSON array
    const start = rawText.indexOf("[");
    const end = rawText.lastIndexOf("]");

    if (start === -1 || end === -1) {
      console.error("❌ No JSON array found in AI response");
      console.error(rawText);
      return [];
    }

    const jsonString = rawText.slice(start, end + 1);

    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      console.error("❌ Parsed data is not an array:", parsed);
      return [];
    }

    return parsed; // [{ question }]
  } catch (error) {
    console.error("❌ Cohere Interview AI Error:", error.message);
    return [];
  }
};

// import { CohereClient } from "cohere-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const cohere = new CohereClient({
//   token: process.env.API,
// });

// // Utility: sanitize raw string before JSON.parse
// function sanitizeJsonString(str) {
//   return str
//     .replace(/json|```/gi, "")
//     .replace(/\s+/g, " ")
//     .replace(/“|”/g, '"')
//     .replace(/‘|’/g, "'")
//     .replace(/,\s*}/g, "}")
//     .replace(/,\s*]/g, "]");
// }

// export const generateInterviewQuestions = async ({ category, difficulty }) => {
//   try {
//     console.log(category, difficulty)
//     const response = await cohere.chat({
//       model: "command-a-03-2025",
//       message: `
// You are a professional interview panel, tech interviewer.

// Generate exactly 5 interview questions, like what are react hooks, what are APIs.

// Category: ${category}
// Difficulty: ${difficulty}

// Rules:
// - Questions must sound like real online interviews
// - No answers
// - No explanations
// - No numbering
// - Output ONLY a valid JSON array
// - Each element must follow this schema:

// {
//   "question": "string"
// }

// Return ONLY raw JSON. No markdown.
//       `,
//       temperature: 0.3,
//       max_tokens: 1200,
//     });

//     let jsonString = response.text.trim();

//     // Extract JSON array only
//     if (jsonString.includes("[") && jsonString.includes("]")) {
//       jsonString = jsonString.substring(
//         jsonString.indexOf("["),
//         jsonString.lastIndexOf("]") + 1
//       );
//     }

//     jsonString = sanitizeJsonString(jsonString);

//     let parsed;
//     try {
//       parsed = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("❌ JSON Parse Error:", err.message);
//       console.error("Preview:", jsonString.slice(0, 400));
//       return [];
//     }

//     if (!Array.isArray(parsed)) {
//       console.error("❌ Expected array, got:", parsed);
//       return [];
//     }

//     console.log(typeof parsed);
//     return parsed; // [{ question }]
//   } catch (error) {
//     console.error("❌ Cohere Interview AI Error:", error);
//     return [];
//   }
// };

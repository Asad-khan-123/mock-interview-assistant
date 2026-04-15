import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config();

const cohere = new CohereClient({
  token: process.env.API,
});

export const analyzeInterview = async (interview) => {
  try {

    const qaPairs = interview.answers.map((item) => ({
      question: item.question,
      answer: item.answerText,
    }));

    console.log("AI Analysis Input:", qaPairs);

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: `
Return ONLY valid JSON.

You are a senior technical interviewer.
Analyze the following interview question-answer pairs.

Evaluate:
- Correctness
- Concept clarity
- Depth of explanation
- Relevance

Rules:
- Give overall score out of 100
- Identify strong topics
- Identify weak topics
- Give short professional feedback
- No markdown
- No extra text
- JSON only

Schema:
{
  "score": number,
  "strongTopics": ["string"],
  "weakTopics": ["string"],
  "feedback": "string"
}

Interview Data:
${JSON.stringify(qaPairs)}
      `,
      temperature: 0.3,
      max_tokens: 800,
    });

    const rawText = response.text.trim();

    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("❌ No JSON object found in AI response");
      console.error(rawText);
      return null;
    }

    const jsonString = rawText.slice(start, end + 1);
    const parsed = JSON.parse(jsonString);

    return parsed;

  } catch (error) {
    console.error("❌ Cohere Analysis Error:", error.message);
    return null;
  }
};
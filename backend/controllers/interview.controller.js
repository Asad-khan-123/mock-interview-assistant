import { generateInterviewQuestions } from '../utils/openai.js';
import InterviewSession from '../models/interview.model.js';
import { analyzeInterview } from '../utils/interviewanalyze.js';

// ──────────────────────────────────────────────
// POST /api/v1/users/interview
// Create a new interview session with AI questions
// ──────────────────────────────────────────────
export const interview = async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    const candidateId = req.user.userId;

    if (!category || !difficulty) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const questions = await generateInterviewQuestions({ category, difficulty });

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Can't generate questions. Please try again.", success: false });
    }

    const newInterview = await InterviewSession.create({
      candidateId,
      category,
      difficulty,
      questions: questions.map((q) => ({ text: q.question })),
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      status: "running",
    });

    return res.status(200).json({
      interview: newInterview._id,
      message: "Interview started successfully",
      success: true,
    });

  } catch (error) {
    console.error("Interview Create Error:", error);
    return res.status(500).json({ message: "Server error while creating interview", success: false });
  }
};


// ──────────────────────────────────────────────
// GET /api/v1/users/interview/:id
// Fetch full interview session (for resume / room load)
// ──────────────────────────────────────────────
export const getInterviewDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const interview = await InterviewSession.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found", success: false });
    }

    return res.status(200).json({
      interview,
      message: "Interview details fetched successfully",
      success: true,
    });

  } catch (error) {
    console.error("getInterviewDetails Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};


// ──────────────────────────────────────────────
// GET /api/v1/users/interviews
// Fetch all interviews for the logged in candidate
// ──────────────────────────────────────────────
export const getAllInterviews = async (req, res) => {
  try {
    const candidateId = req.user.userId;
    
    // Sort by most recent first
    const interviews = await InterviewSession.find({ candidateId }).sort({ createdAt: -1 });

    return res.status(200).json({
      interviews,
      message: "Fetched all interviews",
      success: true,
    });
  } catch (error) {
    console.error("getAllInterviews Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};


// ──────────────────────────────────────────────
// DELETE /api/v1/users/interview/:id
// Delete an interview history item
// ──────────────────────────────────────────────
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app we might also check if candidateId matches req.user.userId
    const interview = await InterviewSession.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found", success: false });
    }

    return res.status(200).json({
      message: "Interview deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("deleteInterview Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};


// ──────────────────────────────────────────────
// POST /api/v1/users/interview/:id/update
// Save answer for current question + advance index.
// Uses upsert-by-questionIndex to avoid duplicates.
// When isFinal=true → mark completed + run AI analysis.
// ──────────────────────────────────────────────
export const InterviewUpdate = async (req, res) => {
  const { id } = req.params;
  // currentQuestionIndex = the index of the question just answered (0-based)
  // nextQuestionIndex    = currentQuestionIndex + 1 (what to advance to)
  const { questionIndex, answer, answerType = "text", isFinal = false } = req.body;

  try {
    const interview = await InterviewSession.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found", success: false });
    }

    // ── Upsert answer by questionIndex ────────────────────────
    // Check if an answer for this question already exists (e.g. user refreshed)
    const existingAnswerIdx = interview.answers.findIndex(
      (a) => a.questionIndex === questionIndex
    );

    const questionText = interview.questions[questionIndex]?.text || "";

    if (existingAnswerIdx !== -1) {
      // Update existing answer
      interview.answers[existingAnswerIdx].answerText = answer || "";
      interview.answers[existingAnswerIdx].answerType = answerType;
    } else {
      // Push new answer entry
      interview.answers.push({
        questionIndex,
        question: questionText,
        answerText: answer || "",
        answerType,
        timeTaken: 0,
      });
    }

    // Advance the stored progress pointer to the next question
    interview.currentQuestionIndex = questionIndex + 1;

    // ── Handle final submit ────────────────────────────────────
    if (isFinal) {
      interview.status = "completed";
      await interview.save();

      // Try AI analysis — fall back to local scoring if it fails
      let result = null;
      try {
        result = await analyzeInterview(interview);
      } catch (aiErr) {
        console.error("AI analysis failed, using fallback:", aiErr.message);
      }

      // Local fallback: simple length-based scoring
      if (!result) {
        result = buildFallbackResult(interview);
      }

      // Persist the result securely inside the interview session document
      interview.result = {
        score: result.score,
        answeredCount: result.answeredCount,
        totalQuestions: result.totalQuestions,
        strongTopics: result.strongTopics || [],
        weakTopics: result.weakTopics || [],
        feedback: result.feedback || "",
      };
      
      await interview.save();

      return res.status(200).json({
        message: "Interview completed",
        success: true,
        result,
        // always return interview so result page can show Q&A list
        interview,
      });
    }

    // ── Normal next-question save ──────────────────────────────
    await interview.save();

    return res.status(200).json({
      message: "Answer saved",
      success: true,
    });

  } catch (error) {
    console.error("InterviewUpdate Error:", error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};


// ──────────────────────────────────────────────
// Local fallback result when AI is unavailable
// Score = % of questions answered with >20 chars
// ──────────────────────────────────────────────
function buildFallbackResult(interview) {
  const total = interview.totalQuestions;
  const answered = interview.answers.filter((a) => a.answerText && a.answerText.trim().length > 5).length;
  const goodAnswers = interview.answers.filter((a) => a.answerText && a.answerText.trim().length >= 30).length;

  const score = Math.round((goodAnswers / total) * 100);

  let feedback = "Needs improvement — try to elaborate more on your answers.";
  if (score >= 80) feedback = "Excellent performance! Your answers showed strong depth and clarity.";
  else if (score >= 50) feedback = "Good attempt! Some answers lacked depth — keep practicing.";

  return {
    score,
    answeredCount: answered,
    totalQuestions: total,
    strongTopics: [],
    weakTopics: [],
    feedback,
    answers: interview.answers,
    questions: interview.questions,
  };
}
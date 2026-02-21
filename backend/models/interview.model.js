import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    answerText: {
      type: String, // voice → text OR typed answer
      default: "",
    },
    question: {
      type: String,
      required: true,
    },
    answerType: {
      type: String,
      enum: ["voice", "text", "code"],
      default: "voice",
    },
    timeTaken: {
      type: Number, // seconds
      default: 0,
    },
  },
  { _id: false }
);

const InterviewSessionSchema = new mongoose.Schema(
  {
    // 🔐 Session Identity
    sessionId: {
      type: String,
      required: false
    },

    // 👤 Candidate (future use)
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 🧪 Interview Meta
    category: {
      type: String,
      enum: ["Reactjs", "MERN Stack", "Fullstack", "DSA", "HR"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // 📊 Interview Progress
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["running", "completed", "terminated"],
      default: "running",
    },

    // ❓ Questions snapshot
    questions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        text: String,
      },
    ],

    // ✍️ Answers
    answers: [AnswerSchema],

    // 📝 Feedback
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InterviewSession", InterviewSessionSchema);
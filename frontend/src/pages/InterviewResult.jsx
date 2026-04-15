import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InterviewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const interview = location.state?.interview;

  // ── No data fallback ─────────────────────────────────────────────
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <p className="text-slate-400">No result data found.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const {
    score,
    answeredCount,
    totalQuestions,
    strongTopics = [],
    weakTopics = [],
    feedback,
    answers = [],
    questions = [],
  } = result;

  // Use interview.questions if result.questions is empty (AI result path)
  const allQuestions = questions.length > 0 ? questions : (interview?.questions || []);
  const allAnswers = answers.length > 0 ? answers : (interview?.answers || []);

  const total = totalQuestions || allQuestions.length;
  const answered = answeredCount ?? allAnswers.filter((a) => a.answerText?.trim().length > 0).length;
  const unanswered = total - answered;

  // ── Helpers ──────────────────────────────────────────────────────
  const getPerformanceLabel = () => {
    if (score >= 80) return { text: "Excellent 🚀", color: "text-green-400" };
    if (score >= 60) return { text: "Good 👍", color: "text-blue-400" };
    if (score >= 40) return { text: "Average 🤔", color: "text-yellow-400" };
    return { text: "Needs Improvement 💪", color: "text-red-400" };
  };

  const getScoreBg = () => {
    if (score >= 80) return "from-green-600 to-emerald-700";
    if (score >= 60) return "from-blue-600 to-indigo-700";
    if (score >= 40) return "from-yellow-600 to-orange-700";
    return "from-red-600 to-rose-800";
  };

  const perf = getPerformanceLabel();

  // Build a lookup of questionIndex → answerText for the Q&A section
  const answerLookup = {};
  allAnswers.forEach((a) => {
    answerLookup[a.questionIndex] = a.answerText;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">📋 Interview Performance Report</h1>
          <p className="text-slate-400">Here's your detailed summary and feedback</p>
        </div>

        {/* SCORE CARD */}
        <div className={`bg-gradient-to-r ${getScoreBg()} rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6`}>
          <div>
            <p className="text-sm uppercase tracking-widest opacity-70 mb-1">Overall Score</p>
            <p className="text-6xl font-black">{score}%</p>
            <p className={`text-xl font-semibold mt-2 ${perf.color}`}>{perf.text}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-white/70 mt-1">Total</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-300">{answered}</p>
              <p className="text-xs text-white/70 mt-1">Answered</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-300">{unanswered}</p>
              <p className="text-xs text-white/70 mt-1">Skipped</p>
            </div>
          </div>
        </div>

        {/* STRENGTHS & WEAKNESSES */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-green-400 mb-4">💪 Strong Areas</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              {strongTopics.length > 0 ? (
                strongTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">✔</span> {topic}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">Keep practicing — strong areas will appear here!</li>
              )}
            </ul>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Weak Areas</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-red-400">✘</span> {topic}
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No major weaknesses detected 🎉</li>
              )}
            </ul>
          </div>
        </div>

        {/* AI FEEDBACK */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📝 AI Feedback</h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            {feedback || "No feedback available."}
          </p>
        </div>

        {/* FULL Q&A REVIEW */}
        {allQuestions.length > 0 && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-semibold text-purple-400 mb-5">🗂 Question & Answer Review</h3>
            <div className="space-y-5">
              {allQuestions.map((q, i) => {
                const userAnswer = answerLookup[i] || allAnswers[i]?.answerText || "";
                const hasAnswer = userAnswer.trim().length > 0;
                return (
                  <div key={i} className="border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-white font-medium">
                        <span className="text-slate-400 mr-2">Q{i + 1}.</span>
                        {q.text}
                      </p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${hasAnswer ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                        {hasAnswer ? "Answered" : "Skipped"}
                      </span>
                    </div>
                    {hasAnswer ? (
                      <p className="text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2 leading-relaxed">
                        {userAnswer}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600 italic">No answer provided.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FOOTER / CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
          >
            🔄 Start New Interview
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
          >
            🏠 Dashboard
          </button>
        </div>

        <p className="text-center text-slate-600 text-sm">
          Keep practicing consistently 🚀 — improvement is a process.
        </p>
      </div>
    </div>
  );
};

export default InterviewResult;
import React from "react";
import { useLocation } from "react-router-dom";

const InterviewResult = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        No result data found.
      </div>
    );
  }

  const { score, strongTopics, weakTopics, feedback } = result;

  // Dynamic message based on score
  const getPerformanceMessage = () => {
    if (score >= 80) return "Excellent performance! 🚀";
    if (score >= 60) return "Good attempt 👍 — Keep improving!";
    return "Needs improvement — Don’t give up 💪";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Interview Performance Report
          </h1>
          <p className="text-slate-400">
            Here’s your performance summary and improvement areas
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-10 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
          <p className="text-4xl font-bold">{score}%</p>
          <p className="text-sm mt-2 opacity-80">
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Strength & Weakness Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Strong Areas */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              💪 Strong Areas
            </h3>
            <ul className="space-y-2 text-slate-300">
              {strongTopics && strongTopics.length > 0 ? (
                strongTopics.map((topic, index) => (
                  <li key={index}>✔ {topic}</li>
                ))
              ) : (
                <li>No strong areas identified</li>
              )}
            </ul>
          </div>

          {/* Weak Areas */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
            <h3 className="text-lg font-semibold text-red-400 mb-4">
              ⚠️ Weak Areas
            </h3>
            <ul className="space-y-2 text-slate-300">
              {weakTopics && weakTopics.length > 0 ? (
                weakTopics.map((topic, index) => (
                  <li key={index}>✘ {topic}</li>
                ))
              ) : (
                <li>No weak areas detected 🎉</li>
              )}
            </ul>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="mt-10 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">
            📝 AI Feedback
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {feedback || "No feedback available."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          Keep practicing consistently 🚀 Improvement is a process.
        </div>

      </div>
    </div>
  );
};

export default InterviewResult;
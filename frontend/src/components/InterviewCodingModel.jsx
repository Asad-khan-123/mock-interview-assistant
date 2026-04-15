import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";

export default function InterviewCodingModel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("interviewId");

  const [interviewData, setInterviewData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your solution here\n");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [codeMap, setCodeMap] = useState({}); // { questionIndex: code }

  // ── Load interview session from DB ──
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) {
        alert("No active interview found.");
        navigate("/coding");
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/users/interview/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setInterviewData(data.interview);
        setCurrentIndex(data.interview.currentQuestionIndex || 0);

        // Restore saved code from DB answers
        const map = {};
        (data.interview.answers || []).forEach((a) => {
          map[a.questionIndex] = a.answerText;
        });
        setCodeMap(map);
        setCode(map[data.interview.currentQuestionIndex] || "// Write your solution here\n");
      } catch (err) {
        console.error("Failed to load coding interview:", err);
        navigate("/coding");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update code area when question changes
  useEffect(() => {
    setCode(codeMap[currentIndex] || "// Write your solution here\n");
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save answer + advance or submit ──
  const handleSave = async (isFinal = false) => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/users/interview/${id}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionIndex: currentIndex,
            answer: code,
            answerType: "code",
            isFinal,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to save.");
        return;
      }

      if (isFinal) {
        navigate("/interview-result", {
          state: { result: data.result, interview: data.interview },
        });
        return;
      }

      // Update local map and advance index
      setCodeMap((prev) => ({ ...prev, [currentIndex]: code }));
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      alert("Network error. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white text-lg">
        ⏳ Loading coding interview...
      </div>
    );
  }

  const questions = interviewData?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">

      {/* HEADER */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">💻 Coding Interview</h2>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded">
            {interviewData?.difficulty}
          </span>
        </div>
        <span className="text-sm text-slate-400">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Question */}
        <div className="w-2/5 p-6 border-r border-slate-700 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Question</h3>
          <div className="text-sm leading-7 text-slate-200 whitespace-pre-wrap bg-slate-800 rounded-xl p-4 border border-slate-700">
            {currentQuestion?.text || "Loading question..."}
          </div>

          {/* Quick question nav */}
          <div className="mt-6">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Question Navigator</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCodeMap((prev) => ({ ...prev, [currentIndex]: code }));
                    setCurrentIndex(i);
                  }}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    i === currentIndex
                      ? "bg-blue-600 text-white"
                      : codeMap[i]
                      ? "bg-green-700/50 text-green-300 border border-green-600"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Code Editor */}
        <div className="w-3/5 flex flex-col">

          {/* Editor toolbar */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>

            <div className="flex gap-3">
              {!isLastQuestion ? (
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Next →"}
                </button>
              ) : (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {saving ? "Submitting..." : "✅ Submit"}
                </button>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
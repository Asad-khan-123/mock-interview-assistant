import { InterviewContext } from "../../context/InterviewContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
  const interviewState = useContext(InterviewContext);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("interviewId");

  const { currentQuestionIndex, interviewData, answers, setCurrentQuestionIndex, setAnswers, setAnswersMap } = interviewState;

  const totalQuestions = interviewData?.totalQuestions || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // ─────────────────────────────────────────────────────────────
  // handleUpdate: saves the current answer and advances the index.
  // isFinal = true  → marks interview completed + gets result
  // isFinal = false → saves answer + moves to next question
  // ─────────────────────────────────────────────────────────────
  const handleUpdate = async (isFinal = false) => {
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
            questionIndex: currentQuestionIndex,   // 0-based index of question just answered
            answer: answers || "",
            answerType: "text",
            isFinal,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save answer. Please try again.");
        return;
      }

      if (isFinal) {
        // Navigate to result page with full result data
        navigate("/interview-result", {
          state: {
            result: data.result,
            interview: data.interview,
          },
        });
        return;
      }

      // ── Normal next-question flow ──
      // Update local answersMap so MainPanel can pre-fill if user navigates back (future)
      setAnswersMap((prev) => ({ ...prev, [currentQuestionIndex]: answers || "" }));
      setAnswers(""); // Clear answer input for next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);

    } catch (err) {
      console.error("handleUpdate error:", err);
      alert("Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => handleUpdate(false);
  const handleSubmit = () => handleUpdate(true);

  return (
    <div className="h-16 w-full flex items-center justify-between">

      {/* Left: Progress */}
      <span className="text-sm text-slate-400">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </span>

      {/* Right: Action Button */}
      <div className="flex items-center gap-3">
        {saving ? (
          <span className="text-sm text-slate-400 animate-pulse">Saving...</span>
        ) : !isLastQuestion ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Next Question →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            ✅ Submit Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
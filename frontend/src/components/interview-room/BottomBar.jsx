import { InterviewContext } from "../../context/interviewContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
  const interviewState = useContext(InterviewContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("interviewId");

  const handleUpdate = async (isFinal = false) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/users/interview/${id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentQuestionIndex:
            interviewState.currentQuestionIndex + 1,
          answer: interviewState.answers,
          isFinal: isFinal,
        }),
      }
    );


    // ✅ Agar final submit hai to result page redirect
    if (isFinal) {
      const res = await fetch(
      `http://localhost:8000/api/v1/users/interview/${id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentQuestionIndex:
            interviewState.currentQuestionIndex + 1,
          answer: interviewState.answers,
          isFinal: isFinal,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to update interview");
      return;
    }
      navigate("/interview-result", { state: { result: data.result } });
    }
  };

  const handleNext = () => {
    handleUpdate(false);
    interviewState.setCurrentQuestionIndex(
      interviewState.currentQuestionIndex + 1
    );
  };

  const handleSubmit = () => {
    handleUpdate(true);
  };

  const isLastQuestion =
    interviewState.currentQuestionIndex ===
    interviewState.interviewData.totalQuestions - 1;

  return (
    <div className="h-16 w-full border-t border-slate-700 bg-slate-900 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700"
          >
            Submit Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomBar;
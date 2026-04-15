import { useEffect, useState, useContext } from "react";
import BottomBar from "../components/interview-room/BottomBar";
import LeftPanel from "../components/interview-room/LeftPanel";
import MainPanel from "../components/interview-room/MainPanel";
import TopBar from "../components/interview-room/TopBar";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/InterviewContext";

const InterviewRoom = () => {
  const navigate = useNavigate();
  const interviewState = useContext(InterviewContext);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("interviewId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        if (!id) {
          alert("No active interview found. Redirecting to selection page.");
          navigate("/interview");
          return;
        }

        const res = await fetch(
          `http://localhost:8000/api/v1/users/interview/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch interview");
        }

        // ✅ Restore full interview data
        interviewState.setInterviewData(data.interview);

        // ✅ Resume: restore question index from DB
        interviewState.setCurrentQuestionIndex(data.interview.currentQuestionIndex || 0);

        // ✅ Resume: rebuild answersMap from saved answers array
        const map = {};
        (data.interview.answers || []).forEach((a) => {
          map[a.questionIndex] = a.answerText;
        });
        interviewState.setAnswersMap(map);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
        navigate("/interview");
      }
    };

    fetchInterviewDetails();
  }, [id, token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-lg">
        ⏳ Preparing your interview...
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-rows-[60px_1fr_70px] bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <div className="border-b border-slate-700 px-4 flex items-center h-full">
        <TopBar />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-[minmax(320px,420px)_1fr] overflow-hidden">
        {/* Left Panel — Webcam + posture */}
        <div className="border-r border-slate-700 p-3 overflow-hidden">
          <LeftPanel />
        </div>

        {/* Main Panel — Question + Answer */}
        <div className="p-4 overflow-hidden">
          <MainPanel />
        </div>
      </div>

      {/* Bottom Bar — Navigation buttons */}
      <div className="border-t border-slate-700 px-4 flex items-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default InterviewRoom;

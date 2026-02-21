import { useEffect, useState } from "react";
import BottomBar from "../components/interview-room/BottomBar";
import LeftPanel from "../components/interview-room/LeftPanel";
import MainPanel from "../components/interview-room/MainPanel";
import TopBar from "../components/interview-room/TopBar";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { InterviewContext } from "../context/interviewContext";

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
          navigate("/");
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
          },
        );

        const data = await res.json();
        console.log("Fetched interview details:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch interview");
        }

        interviewState.setInterviewData(data.interview); // ✅ STORE DATA
        interviewState.setCurrentQuestionIndex(data.interview.currentQuestionIndex); // ✅ SET CURRENT QUESTION INDEX
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
        navigate("/interview");
      }
    };

    fetchInterviewDetails();
  }, [id, token, navigate]); // ✅ dependency array



  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Preparing your interview...
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
      <div className="grid grid-cols-[minmax(320px,420px)_1fr]">
        {/* Left Panel */}
        <div className="border-r border-slate-700 p-3">
          <LeftPanel />
        </div>

        {/* Main Panel */}
        <div className="p-4">
          <MainPanel />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 px-4 flex items-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default InterviewRoom;

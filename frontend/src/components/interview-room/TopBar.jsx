import { useContext, useEffect, useRef, useState } from "react";
import { InterviewContext } from "../../context/InterviewContext";

const TopBar = () => {
  const { interviewData, warningCount } = useContext(InterviewContext);

  // Live count-up timer (seconds since interview room loaded)
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Format seconds → MM:SS
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-full w-full flex items-center justify-between px-4">

      {/* Left: Interview Category + Difficulty */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">
          {interviewData?.category || "Interview"}
        </h2>
        <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
          {interviewData?.difficulty || "N/A"}
        </span>
      </div>

      {/* Center: Live Timer + Warning Count */}
      <div className="flex items-center gap-6">
        <span className="text-sm text-slate-300">
          ⏱ {formatTime(elapsed)}
        </span>

        {/* Posture warning count — updates from LeftPanel via context */}
        <span className={`text-sm ${warningCount > 0 ? "text-yellow-400" : "text-slate-500"}`}>
          ⚠ Warnings: {warningCount}
        </span>
      </div>

      {/* Right: End Interview */}
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to end the interview early?")) {
            // Navigate back to dashboard
            window.location.href = "/";
          }
        }}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition-colors"
      >
        End Interview
      </button>
    </div>
  );
};

export default TopBar;
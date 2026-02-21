import {InterviewContext} from '../../context/interviewContext'; 
import { useContext } from 'react';

const TopBar = ({}) => {
  const interviewState = useContext(InterviewContext);

  return (
    <div className="h-full w-full flex items-center justify-between px-4">

      {/* Left: Interview Info */}
     <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">
          {interviewState.interviewData?.category || "Loading..."}
        </h2>

        {/* Difficulty Badge */}
        <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
          {interviewState.interviewData?.difficulty || "N/A"}
        </span>
      </div>

      {/* Center: Timer & Warnings */}
      <div className="flex items-center gap-6">
        <span className="text-sm">
          ⏱ 00:15:32
        </span>

        <span className="text-sm text-yellow-400">
          ⚠ Warnings: 0
        </span>
      </div>

      {/* Right: End Interview */}
      <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold">
        End Interview
      </button>

    </div>
  );
};

export default TopBar;
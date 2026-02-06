import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const InterviewSelection = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState("MERN Stack");
  const [difficulty, setDifficulty] = useState("Easy");
  const token = localStorage.getItem("token");

  const handleStart = async(e) => {
    e.preventDefault();
    
    const res = await fetch("http://localhost:8000/api/v1/users/interview",{
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      body: JSON.stringify({category: interviewType, difficulty: difficulty})
    }
    )
    
    if(!res.ok){
      alert("Failed to start interview. Please try again.");
    }
    else{
      navigate("/interview-room");
    }
    
  };

  const types = ["Reactjs", "MERN Stack", "DSA"];
  const levels = ["Easy", "Medium", "Hard"];

  return (<>

    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-[#0B1C2D] via-[#102A43] to-[#0A1E2F] flex items-center justify-center px-4">
      
      <form
        onSubmit={handleStart}
        className="w-full max-w-4xl p-10 rounded-3xl bg-[#111827]/90 backdrop-blur border border-[#1F3B5B] shadow-2xl"
      >
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-[#E6F1FF] mb-10">
          🎯 AI Mock Interview Platform
        </h1>

        {/* Interview Type Buttons */}
        <h2 className="text-xl text-[#E6F1FF] mb-4">Choose Interview Type</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-10">
          {types.map((type) => (
            <div
              key={type}
              onClick={() => setInterviewType(type)}
              className={`cursor-pointer p-6 rounded-2xl text-center font-semibold transition-all duration-300
                ${
                  interviewType === type
                    ? "bg-gradient-to-r from-[#3FD1FF] to-[#2563EB] text-[#0B1C2D] shadow-[0_0_25px_#3FD1FF]"
                    : "bg-[#111827] text-[#E6F1FF] hover:bg-[#1F3B5B] hover:shadow-[0_0_15px_rgba(63,209,255,0.3)]"
                }`}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Difficulty Buttons */}
        <h2 className="text-xl text-[#E6F1FF] mb-4">Select Difficulty</h2>
        <div className="flex gap-6 mb-10 justify-center">
          {levels.map((level) => (
            <label
              key={level}
              className={`px-6 py-3 rounded-full cursor-pointer font-semibold transition-all
                ${
                  difficulty === level
                    ? level === "Easy"
                      ? "bg-green-600 text-white shadow-[0_0_20px_#22c55e]"
                      : level === "Medium"
                      ? "bg-yellow-500 text-black shadow-[0_0_20px_#eab308]"
                      : "bg-red-600 text-white shadow-[0_0_20px_#ef4444]"
                    : "bg-[#111827] text-[#9FB3C8] hover:bg-[#1F3B5B]"
                }`}
            >
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={difficulty === level}
                onChange={() => setDifficulty(level)}
                className="hidden"
              />
              {level}
            </label>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-10 py-4 text-lg font-bold rounded-2xl text-[#0B1C2D]
              bg-gradient-to-r from-[#3FD1FF] to-[#2563EB]
              hover:scale-105 transition-transform
              shadow-[0_0_30px_rgba(63,209,255,0.7)]"
          >
            🚀 Start Interview
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default InterviewSelection;
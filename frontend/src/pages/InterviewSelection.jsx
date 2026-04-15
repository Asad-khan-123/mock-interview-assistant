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
    const data = await res.json();
    
    if(!res.ok){
      alert("Failed to start interview. Please try again.");
    }
    else{
      localStorage.setItem("interviewId", data.interview);
      navigate("/interview-room");
    }
    
  };

const types = ["Reactjs", "Backend (Node/Exp)", "DSA"];
const levels = ["Easy", "Medium", "Hard"];

return (
  <>
    <Navbar />

    <main className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0b1c2d] to-[#0f172a] px-4">
      <form
        onSubmit={handleStart}
        className="w-full max-w-5xlbg-gradient-to-br from-[#0f172a] via-[#0b1c2d] to-[#0f172a] border border-white/10 rounded-3xl p-12 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-white">
            AI Mock Interview for{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Asad
            </span>
          </h1>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base">
            Practice real interviews with AI-powered voice, posture analysis and Get honest feedback and improve faster.
          </p>
        </div>

        {/* Interview Type */}
        <div className="mb-14">
          <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8 text-center">
            Choose Interview Type
          </h2>

          <div className="flex flex-wrap justify-center gap-10">
            {types.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setInterviewType(type)}
                className={`w-40 h-40 rounded-full flex items-center justify-center text-center font-semibold transition-all duration-300 transform
                ${
                  interviewType === type
                    ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-black scale-110 shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                    : "bg-white/5 border border-white/10 text-white hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-14">
          <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8 text-center">
            Select Difficulty
          </h2>

          <div className="flex justify-center gap-8">
            {levels.map((level) => (
              <button
                type="button"
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform
                ${
                  difficulty === level
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-lg"
                    : "bg-white/5 border border-white/10 text-white hover:scale-105 hover:border-purple-400"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition-all duration-300 text-black font-semibold shadow-lg"
          >
            🚀 Start Interview
          </button>
        </div>
      </form>
    </main>
  </>
);
};

export default InterviewSelection;
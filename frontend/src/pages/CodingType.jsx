import Navbar from "../components/layout/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CodingType = () => {
  const [interviewType, setInterviewType] = useState("Coding");
  const [difficulty, setDifficulty] = useState("Easy");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Creates a real interview session in DB then goes to coding room
  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/users/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: interviewType, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create interview. Please try again.");
        return;
      }

      localStorage.setItem("interviewId", data.interview);
      navigate("/coding-interview");
    } catch (err) {
      console.error("CodingType handleStart error:", err);
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const types = ["Coding", "DSA", "Backend (Node/Exp)"];
  const levels = ["Easy", "Medium", "Hard"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0b1c2d] to-[#0f172a] px-4">
        <form
          onSubmit={handleStart}
          className="w-full max-w-4xl border border-white/10 rounded-3xl p-12 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-14 text-center">
            <h1 className="text-4xl font-bold text-white">
              Coding{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base">
              Practice coding rounds with real questions. Write code, debug logic, and submit — just like real online interviews.
            </p>
          </div>

          {/* Interview Type */}
          <div className="mb-14">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8 text-center">
              Choose Focus Area
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
              disabled={loading}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:scale-105 transition-all duration-300 text-black font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating session..." : "🚀 Start Coding Interview"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
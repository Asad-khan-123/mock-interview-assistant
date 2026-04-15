import { useNavigate } from "react-router-dom";

export default function WelcomeSection() {
  const username = localStorage.getItem("user");
  const navigate = useNavigate(); 

  return (
    <div className="bg-gradient-to-r from-[#0B1C2D] to-[#102A43] 
    border border-[#1F3B5B] rounded-2xl p-8 shadow-xl">

      <h1 className="text-3xl font-bold text-[#E6F1FF]">
        Welcome back, <span className="text-[#3FD1FF]">{username} 👋</span>
      </h1>

      <p className="text-[#9FB3C8] mt-2 max-w-xl">
        Practice real interviews with AI-powered voice, video, posture
        and coding analysis — just like real interview rounds.
      </p>

      <div className="mt-6 flex gap-4">
        <button 
          onClick={() => navigate("/interview")}
          className="px-6 py-3 rounded-lg bg-[#3FD1FF] 
          text-[#0B1C2D] font-semibold hover:shadow-[0_0_15px_#3FD1FF]"
        >
          Start Theory Interview
        </button>

        <button 
          onClick={() => navigate("/coding")}
          className="px-6 py-3 rounded-lg border border-[#1F3B5B] 
          text-[#E6F1FF] hover:bg-[#0B1C2D]"
        >
          Start Coding Round
        </button>
      </div>
    </div>
  );
}
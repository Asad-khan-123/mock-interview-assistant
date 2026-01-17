import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const[username, setUsername] = useState("");
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();

  const handleSignup = async(e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/v1/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const data = await res.json();

    if(!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("Signup successful! Please log in.");
    // Optionally, redirect to login page
    navigate("/login");
  }

  



  return (
    <div className="min-h-screen flex bg-[#0B1C2D] text-white">

      {/* LEFT – INTERVIEW PREVIEW (SAME AS LOGIN) */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <div className="space-y-6">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#E6F1FF]">
              AI Mock Interview
            </h1>
            <p className="text-[#9FB3C8] mt-2">
              Voice • Video • Pose • Confidence Analysis
            </p>
          </div>

          {/* Interview Frame */}
          <div
            className="w-[320px] h-[420px] rounded-2xl border border-[#1F3B5B]
            bg-[#0B1C2D]/80 backdrop-blur-xl shadow-2xl p-4 flex flex-col justify-between"
          >

            {/* AI Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#3FD1FF] flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <p className="text-sm text-[#E6F1FF] font-medium">
                  AI Interviewer
                </p>
                <p className="text-xs text-[#9FB3C8] animate-pulse">
                  Asking question...
                </p>
              </div>
            </div>

            {/* Video Preview */}
            <div
              className="relative w-full h-[180px] rounded-xl bg-[#102A43]
              border border-[#1F3B5B] flex items-center justify-center"
            >
              <span className="text-4xl">🎥</span>

              <div
                className="absolute bottom-2 left-2 text-xs
                bg-[#0B1C2D]/80 px-2 py-1 rounded text-[#3FD1FF]"
              >
                Pose detected ✓
              </div>

              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>

            {/* Voice Wave */}
            <div className="flex items-end justify-center gap-1 h-16">
              {[12, 26, 38, 22, 30, 18, 10].map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded bg-[#3FD1FF] animate-pulse"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            {/* Analysis */}
            <div className="space-y-3 text-xs text-[#9FB3C8]">
              <Stat label="Confidence" value="78%" width="78%" />
              <Stat label="Nervousness" value="Low" width="25%" />
              <Stat label="Posture" value="Good" width="80%" />
            </div>

            <p className="text-[10px] text-center text-[#6B85A6]">
              Live AI evaluation preview
            </p>
          </div>
        </div>
      </div>

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:flex items-center">
        <div className="h-[70%] w-px bg-[#1F3B5B]" />
      </div>

      {/* RIGHT – SIGNUP FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-[400px] bg-[#102A43] p-8 rounded-xl border border-[#1F3B5B] shadow-2xl">
        <form onSubmit={(e) => {handleSignup(e)}}>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create your account
          </h2>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full name"
            className="w-full mb-4 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            className="w-full mb-4 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full mb-5 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <button
          type="submit"
            className="w-full py-3 rounded-md bg-[#3FD1FF]
            text-[#0B1C2D] font-semibold hover:shadow-[0_0_15px_#3FD1FF]"
          >
            Sign up
          </button>
        </form>

          <Divider />

          <button
            className="w-full py-3 rounded-md border border-[#1F3B5B]
            flex items-center justify-center gap-3 hover:bg-[#0B1C2D]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="Google"
            />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-[#9FB3C8] mt-6">
            Already have an account?{" "}
            <Link to='/login' className="text-[#3FD1FF] cursor-pointer hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Components */
function Divider() {
  return (
    <div className="flex items-center my-5">
      <div className="flex-grow h-px bg-[#1F3B5B]" />
      <span className="mx-3 text-xs text-[#9FB3C8]">OR</span>
      <div className="flex-grow h-px bg-[#1F3B5B]" />
    </div>
  );
}

function Stat({ label, value, width }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-[#3FD1FF]">{value}</span>
      </div>
      <div className="w-full h-1 bg-[#1F3B5B] rounded">
        <div className="h-1 bg-[#3FD1FF] rounded" style={{ width }} />
      </div>
    </div>
  );
}
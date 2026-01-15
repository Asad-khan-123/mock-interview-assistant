import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-[#0B1C2D] text-white">

      {/* LEFT – BRAND INFO (Same as Signup) */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <div className="text-center max-w-sm space-y-6">

          <h1 className="text-4xl font-bold text-[#E6F1FF]">
            AI Mock Interview
          </h1>

          <p className="text-[#9FB3C8] text-sm leading-relaxed">
            Practice real interviews with AI-powered voice, posture,
            and confidence analysis. Get honest feedback and improve faster.
          </p>

          {/* Feature Card */}
          <div
            className="w-[260px] mx-auto rounded-2xl border border-[#1F3B5B]
            bg-[#0B1C2D]/70 backdrop-blur-xl shadow-xl p-5 space-y-4"
          >
            <Feature text="🎤 Voice confidence analysis" />
            <Feature text="🎥 Body posture detection" />
            <Feature text="🤖 AI interviewer experience" />
            <Feature text="📊 Detailed feedback reports" />
          </div>

          <p className="text-xs text-[#6B85A6]">
            Trusted by students & professionals
          </p>
        </div>
      </div>

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:flex items-center">
        <div className="h-[70%] w-px bg-[#1F3B5B]" />
      </div>

      {/* RIGHT – LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-[380px] bg-[#102A43] p-8 rounded-xl border border-[#1F3B5B] shadow-2xl">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Log in to your account
          </h2>

          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-4 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-5 p-3 rounded-md bg-[#0B1C2D]
              border border-[#1F3B5B] focus:border-[#3FD1FF] outline-none"
          />

          <button
            className="w-full py-3 rounded-md bg-[#3FD1FF]
            text-[#0B1C2D] font-semibold hover:shadow-[0_0_15px_#3FD1FF]"
          >
            Login
          </button>

          {/* Divider */}
          <Divider />

          {/* Google Login */}
          <button
            className="w-full py-3 rounded-md border border-[#1F3B5B]
            flex items-center justify-center gap-3 hover:bg-[#0B1C2D]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#9FB3C8] mt-6">
            Don’t have an account?{" "}
            <Link to='/signup' className="text-[#3FD1FF] cursor-pointer hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Small Components */
function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#9FB3C8]">
      <span className="text-[#3FD1FF]">●</span>
      {text}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center my-5">
      <div className="flex-grow h-px bg-[#1F3B5B]" />
      <span className="mx-3 text-xs text-[#9FB3C8]">OR</span>
      <div className="flex-grow h-px bg-[#1F3B5B]" />
    </div>
  );
}
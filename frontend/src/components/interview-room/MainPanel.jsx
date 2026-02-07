import { useEffect, useRef, useState } from "react";

const MainPanel = () => {
  const [messages, setMessages] = useState([
    {
      role: "interviewer",
      text: "Tell me about yourself.",
    },
  ]);

  const [liveTranscript, setLiveTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [botThinking, setBotThinking] = useState(false);

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript, botThinking]);

  // 🎙 Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLiveTranscript(transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  // 🎙 Start speaking
  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  // 🛑 Stop + submit
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);

    if (!liveTranscript.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "candidate", text: liveTranscript },
    ]);

    setLiveTranscript("");
    setBotThinking(true);

    // 🤖 fake interviewer response (AI later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "interviewer",
          text: "Interesting. Can you explain one challenge you faced?",
        },
      ]);
      setBotThinking(false);
    }, 1800);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700">

      {/* 💬 Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-3 rounded-xl text-sm ${
              msg.role === "interviewer"
                ? "bg-slate-800 text-white"
                : "bg-blue-600 text-white ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* 🎙 Live Transcript */}
        {listening && (
          <div className="max-w-[75%] px-4 py-3 rounded-xl text-sm bg-blue-500/30 text-blue-100 ml-auto border border-blue-500">
            {liveTranscript || "Listening..."}
          </div>
        )}

        {botThinking && (
          <div className="text-slate-400 italic text-sm">
            Interviewer is analyzing your answer...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 🎙 Voice Control */}
      <div className="border-t border-slate-700 p-4 flex justify-between items-center">
        <p className="text-slate-400 text-sm">
          {listening
            ? "Speak clearly. Your answer is being recorded."
            : "Click mic to answer verbally"}
        </p>

        <button
          onClick={listening ? stopListening : startListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
            listening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          🎙
        </button>
      </div>
    </div>
  );
};

export default MainPanel;
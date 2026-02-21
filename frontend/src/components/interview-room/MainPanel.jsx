import { useContext, useEffect, useRef, useState } from "react";
import { InterviewContext } from "../../context/interviewContext";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const MainPanel = () => {
  const interviewState = useContext(InterviewContext);
  const bottomRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // ✅ Store only FINAL confirmed text
  const finalTranscriptRef = useRef("");

  // 🔽 Set Question
  useEffect(() => {
    if (
      interviewState?.interviewData &&
      interviewState.interviewData.questions?.length > 0
    ) {
      setQuestion(
        interviewState.interviewData.questions[
          interviewState.currentQuestionIndex
        ].text
      );
    }
  }, [interviewState]);

  // 🔽 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [question, allAnswers]);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // ✅ IMPORTANT FIX
      const updatedAnswer =
        finalTranscriptRef.current + interimTranscript;

      setCurrentAnswer(updatedAnswer);

      // context me latest value bhejo (stale state nahi)
      if (interviewState?.setAnswers) {
        interviewState.setAnswers(updatedAnswer);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [interviewState]);

  // 🎤 Mic Toggle
  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // ✅ Submit Answer (same as yours)
  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    setAllAnswers((prev) => [...prev, currentAnswer]);

    setCurrentAnswer("");
    finalTranscriptRef.current = "";
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {question ? (
          <div className="max-w-[75%] px-4 py-3 rounded-xl text-sm bg-slate-800 text-white">
            {question}
          </div>
        ) : (
          <div className="text-slate-400 text-sm">
            Preparing first question...
          </div>
        )}

        {allAnswers.map((ans, index) => (
          <div
            key={index}
            className="max-w-[75%] px-4 py-3 rounded-xl text-sm bg-blue-600 text-white ml-auto"
          >
            {ans}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-700 p-4 flex gap-2 items-center">
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => {
            const value = e.target.value;

            setCurrentAnswer(value);
            finalTranscriptRef.current = value;

            // typing ke time bhi context update
            if (interviewState?.setAnswers) {
              interviewState.setAnswers(value);
            }
          }}
          placeholder="Speak or type your answer..."
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
        />

        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-lg text-white ${
            isListening ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {isListening ? "Stop 🎙" : "Mic 🎤"}
        </button>

        <button
          onClick={handleAnswerSubmit}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MainPanel;
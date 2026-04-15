import { useContext, useEffect, useRef, useState } from "react";
import { InterviewContext } from "../../context/InterviewContext";

// Use native browser SpeechRecognition API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const MainPanel = () => {
  const {
    interviewData,
    currentQuestionIndex,
    setAnswers,
    answersMap,
    setListening,
  } = useContext(InterviewContext);

  const bottomRef = useRef(null);
  const answerRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(""); // Accumulates final speech results
  const shouldRestartRef = useRef(false); // Controls auto-restart of mic

  // ── Set question + restore saved answer when question index changes ──
  useEffect(() => {
    if (!interviewData?.questions?.length) return;

    const q = interviewData.questions[currentQuestionIndex];
    if (!q) return;

    setQuestion(q.text);

    // Restore previously saved answer for this question (resume support)
    const savedAnswer = answersMap[currentQuestionIndex] || "";
    finalTranscriptRef.current = savedAnswer;

    // Update context so BottomBar can grab it
    setAnswers(savedAnswer);

    // Set the contentEditable div
    if (answerRef.current) {
      answerRef.current.innerText = savedAnswer;
    }

    // Stop mic if it was running (clean transition between questions)
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
    setIsListening(false);
    setListening(false);

  }, [currentQuestionIndex, interviewData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Speak the question aloud ──
  const speakQuestion = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (question) speakQuestion(question);
  }, [question]);

  // ── Auto scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [question]);

  // ── Setup Speech Recognition (created once) ──
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // More stable than continuous=true
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Append final results to accumulated transcript
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Combined: everything confirmed + what's still being said
      const updatedAnswer = finalTranscriptRef.current + interimTranscript;

      // Sync to DOM + context
      if (answerRef.current) {
        answerRef.current.innerText = updatedAnswer;
      }
      setAnswers(updatedAnswer);
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        // Auto-restart to keep mic open while user speaks
        try { recognition.start(); } catch (e) { /* ignore */ }
      } else {
        setIsListening(false);
        setListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setListening(false);
      shouldRestartRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      try { recognition.stop(); } catch (e) { /* ignore */ }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle mic ON / OFF ──
  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      shouldRestartRef.current = false;
      recognitionRef.current.stop();
    } else {
      shouldRestartRef.current = true;
      try { recognitionRef.current.start(); } catch (e) { /* ignore */ }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">

      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* AI Question bubble */}
        {question ? (
          <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-slate-800 text-white leading-relaxed">
            <span className="block text-xs text-slate-400 mb-1">AI Interviewer</span>
            {question}
          </div>
        ) : (
          <div className="text-slate-400 text-sm">Preparing question...</div>
        )}

        {/* User answer bubble (contentEditable) */}
        <div
          ref={answerRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const value = e.currentTarget.innerText;
            // Sync typed changes back to transcript ref and context
            finalTranscriptRef.current = value;
            setAnswers(value);
          }}
          className="max-w-[80%] ml-auto px-4 py-3 rounded-2xl text-sm bg-blue-600 text-white outline-none min-h-[48px] leading-relaxed"
          placeholder="Speak or type your answer here..."
        />

        <div ref={bottomRef} />
      </div>

      {/* Mic controls */}
      <div className="border-t border-slate-700 p-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {isListening ? "🔴 Listening... speak your answer" : "Click Mic to start voice answer"}
        </span>
        <button
          onClick={toggleMic}
          className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isListening ? "⏹ Stop" : "🎤 Mic"}
        </button>
      </div>
    </div>
  );
};

export default MainPanel;
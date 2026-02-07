// components/BottomBar.jsx
const BottomBar = ({
  isLastQuestion,
  onNext,
  editorOpen,
  setEditorOpen,
  listening,
}) => {
  return (
    <div className="h-16 w-full border-t border-slate-700 bg-slate-900 px-4 flex items-center justify-between">

      {/* 🎙 Status */}
      <div className="text-sm text-slate-400 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            listening ? "bg-red-500 animate-pulse" : "bg-slate-500"
          }`}
        ></span>
        {listening ? "Recording answer..." : "Waiting for response"}
      </div>

      {/* 🔘 Actions */}
      <div className="flex items-center gap-3">

        {/* 💻 Code Editor Toggle */}
        <button
          onClick={() => setEditorOpen(!editorOpen)}
          className="px-4 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-white"
        >
          {editorOpen ? "Close Code Editor" : "Open Code Editor"}
        </button>

        {/* ⏭ Next / Submit */}
        <button
          onClick={onNext}
          className={`px-5 py-2 rounded-lg text-sm text-white ${
            isLastQuestion
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLastQuestion ? "Submit Interview" : "Next Question"}
        </button>

      </div>
    </div>
  );
};

export default BottomBar;
const InterviewRoom = () => {
  return (
    <div className="h-screen grid grid-rows-[60px_1fr_70px] bg-slate-950 text-slate-100">

      {/* Top Bar */}
      <div className="border-b border-slate-700 px-4 flex items-center">
        TOP BAR
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-[minmax(320px,420px)_1fr]">
        
        {/* Left Panel */}
        <div className="border-r border-slate-700 p-3">
          LEFT PANEL
        </div>

        {/* Main Panel */}
        <div className="p-4">
          MAIN PANEL
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 px-4 flex items-center">
        BOTTOM BAR
      </div>

    </div>
  );
};

export default InterviewRoom;
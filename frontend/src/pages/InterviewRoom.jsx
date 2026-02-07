import BottomBar from "../components/interview-room/BottomBar";
import LeftPanel from "../components/interview-room/LeftPanel";
import MainPanel from "../components/interview-room/MainPanel";
import TopBar from "../components/interview-room/TopBar";

const InterviewRoom = () => {
  return (
    <div className="h-screen grid grid-rows-[60px_1fr_70px] bg-slate-950 text-slate-100">

      {/* Top Bar */}
      <div className="border-b border-slate-700 px-4 flex items-center h-full">
        <TopBar />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-[minmax(320px,420px)_1fr]">
        
        {/* Left Panel */}
        <div className="border-r border-slate-700 p-3">
          <LeftPanel />
        </div>

        {/* Main Panel */}
        <div className="p-4">
          <MainPanel />
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 px-4 flex items-center">
        <BottomBar />
      </div>

    </div>
  );
};

export default InterviewRoom;
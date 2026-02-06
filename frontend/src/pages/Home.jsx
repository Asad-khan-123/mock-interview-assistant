import Navbar from "../components/layout/Navbar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";

export default function Home() {
  return (
    <div style={{ background: "linear-gradient(180deg, #020617, #0B1C2D)", minHeight: "100vh", color: "#E6F1FF" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {/* Welcome */}
        <WelcomeCard username="Asad" />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Interviews */}
        <RecentInterviews />
      </div>
    </div>
  );
}



// ┌────────── UI / UX (Interview Room) ──────────┐
// │ Camera | Screen | AI Bot | Question | Editor │
// └─────────────────────────────────────────────┘
//                 ↓
// ┌────────── Interview Engine (Logic) ──────────┐
// │ Question flow | Timer | Answer store | State │
// └─────────────────────────────────────────────┘
//                 ↓
// ┌────────── Intelligence & Analysis ───────────┐
// │ AI feedback | Voice | Code eval | Review     │
// └─────────────────────────────────────────────┘
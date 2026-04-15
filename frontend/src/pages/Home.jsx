import Navbar from "../components/layout/Navbar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import { useState, useEffect } from "react";

export default function Home() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/users/interviews", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) {
          setInterviews(data.interviews);
        }
      } catch (err) {
        console.error("Failed to fetch interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview record?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/interview/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setInterviews((prev) => prev.filter((inv) => inv._id !== id));
      } else {
        alert(data.message || "Failed to delete.");
      }
    } catch (err) {
      alert("Server error deleting interview.");
    }
  };

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
        <WelcomeCard />

        {/* Stats Overview */}
        <StatsOverview interviews={interviews} loading={loading} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Interviews */}
        <RecentInterviews interviews={interviews} loading={loading} onDelete={handleDelete} />
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
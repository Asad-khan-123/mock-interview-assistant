import Card from "../common/Card";
import { useNavigate } from "react-router-dom";
import { Mic, Code2, BookOpen } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card title="Quick Actions">
      <div
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <ActionBtn
          icon={<Mic size={18} />}
          text="Start Interview"
          onClick={() => navigate("/interview")}
        />
        <ActionBtn
          icon={<Code2 size={18} />}
          text="Coding Round"
          onClick={() => navigate("/coding")}
        />
        <ActionBtn
          icon={<BookOpen size={18} />}
          text="Practice"
          onClick={() => navigate("/practice")}
        />
      </div>
    </Card>
  );
}

function ActionBtn({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#020617",
        color: "#E5E7EB",
        fontWeight: "500",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#020617";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 14px rgba(0,0,0,0.35)";
      }}
    >
      {icon}
      {text}
    </button>
  );
}
import Card from "../common/Card";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function RecentInterviews({ interviews = [], loading = false, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card title="Recent Interviews">
      {loading ? (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading...</p>
      ) : interviews.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>No interviews found. Take one to see it here!</p>
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: "none", color: "#E5E7EB" }}>
          {interviews.slice(0, 5).map((item, idx) => {
            const hasResult = item.status === "completed" && item.result;
            const scoreDisplay = hasResult ? `${item.result.score}%` : "Running";
            
            return (
              <li
                key={item._id || idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderBottom: idx < Math.min(interviews.length, 5) - 1 ? "1px solid #1F3B5B" : "none",
                  transition: "background 0.2s",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(63,209,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => {
                  if (item.status === "completed") {
                     navigate(`/interview-result`, { state: { interview: item, result: item.result } });
                  } else {
                     navigate(`/interview`); 
                  }
                }}
              >
                <div>
                  <span style={{ display: "block" }}>{item.category} • {item.difficulty}</span>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>
                    {new Date(item.createdAt).toLocaleDateString()} 
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontWeight: "600", color: hasResult ? "#3FD1FF" : "#FBBF24" }}>
                    {scoreDisplay}
                  </span>
                  
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.8
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
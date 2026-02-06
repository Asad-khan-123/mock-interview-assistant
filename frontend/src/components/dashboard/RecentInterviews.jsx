import Card from "../common/Card";

export default function RecentInterviews() {
  const interviews = [
    { title: "Frontend Interview", score: "68%" },
    { title: "DSA Practice", score: "75%" },
    { title: "Backend Interview", score: "70%" },
  ];

  return (
    <Card title="Recent Interviews">
      <ul style={{ padding: 0, margin: 0, listStyle: "none", color: "#E5E7EB" }}>
        {interviews.map((item, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderBottom: idx < interviews.length - 1 ? "1px solid #1F3B5B" : "none",
              transition: "background 0.2s",
              borderRadius: "8px",
              cursor: "default",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(63,209,255,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span>{item.title}</span>
            <span style={{ fontWeight: "600", color: "#3FD1FF" }}>{item.score}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
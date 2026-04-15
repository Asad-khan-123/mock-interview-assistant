import Card from "../common/Card";

export default function StatsOverview({ interviews = [], loading = false }) {
  const completedMocks = interviews.filter((i) => i.status === "completed" && i.result);

  const totalMocksCount = completedMocks.length;

  const topicsSet = new Set(completedMocks.map(i => i.category));
  const topicsExplored = topicsSet.size;

  const questionsSolved = completedMocks.reduce((acc, curr) => acc + (curr.result?.answeredCount || 0), 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      <Card title="🏆 Total Mocks Done">{loading ? "..." : totalMocksCount}</Card>
      <Card title="📚 Topics Explored">{loading ? "..." : topicsExplored}</Card>
      <Card title="🚀 Questions Solved">{loading ? "..." : questionsSolved}</Card>
    </div>
  );
}
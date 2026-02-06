import Card from "../common/Card";

export default function StatsOverview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
      <Card title="🎯 Last Score">72%</Card>
      <Card title="🧠 Interviews Taken">5</Card>
      <Card title="🔥 Strong Area">React</Card>
    </div>
  );
}
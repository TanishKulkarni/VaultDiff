function RiskDashboard({ diffs }) {
  const totalChanges = diffs.length;
  const highRiskCount = diffs.filter(
    (d) => d.risk?.risk_level === "high"
  ).length;

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd" }}>
      <h3>Risk Summary</h3>
      <p>Total Changes Detected: <strong>{totalChanges}</strong></p>
      <p>High Risk Changes: <strong style={{ color: "red" }}>{highRiskCount}</strong></p>
    </div>
  );
}

export default RiskDashboard;

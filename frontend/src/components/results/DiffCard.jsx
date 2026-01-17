function getColor(changeType) {
  if (changeType === "added") return "#d4f8d4";     // green
  if (changeType === "modified") return "#fff3cd"; // yellow
  if (changeType === "removed") return "#f8d7da";  // red
  return "#f5f5f5";
}

function DiffCard({ diff }) {
  return (
    <div
      style={{
        background: getColor(diff.change_type),
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
      }}
    >
      <strong>Change:</strong> {diff.change_type.toUpperCase()} <br />
      {diff.similarity !== null && (
        <small>Similarity: {diff.similarity}</small>
      )}

      <div style={{ marginTop: "0.5rem" }}>
        {diff.oldClause && (
          <p>
            <strong>Old:</strong> {diff.oldClause.text}
          </p>
        )}
        {diff.newClause && (
          <p>
            <strong>New:</strong> {diff.newClause.text}
          </p>
        )}
      </div>

      {diff.risk && (
        <div style={{ marginTop: "0.5rem" }}>
          <span
            style={{
              padding: "0.25rem 0.5rem",
              background: diff.risk.risk_level === "high" ? "red" : "orange",
              color: "white",
              borderRadius: "4px",
            }}
          >
            {diff.risk.risk_level.toUpperCase()} RISK
          </span>

          {diff.risk.explanation && (
            <details style={{ marginTop: "0.5rem" }}>
              <summary>Why is this risky?</summary>
              <p>{diff.risk.explanation}</p>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default DiffCard;

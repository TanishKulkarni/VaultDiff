function SecurityPanel() {
  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid #cce",
        borderRadius: "6px",
        background: "#f4f8ff",
      }}
    >
      <h3>🔒 Security & Privacy by Design</h3>
      <ul style={{ marginTop: "0.5rem" }}>
        <li>✔ No external AI or third-party APIs</li>
        <li>✔ All AI inference runs locally</li>
        <li>✔ Documents are never stored</li>
        <li>✔ LLM never sees raw document text</li>
      </ul>
    </div>
  );
}

export default SecurityPanel;

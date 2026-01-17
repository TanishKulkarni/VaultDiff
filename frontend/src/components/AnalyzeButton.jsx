function AnalyzeButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
    >
      {disabled ? "Analyzing..." : "Analyze Documents"}
    </button>
  );
}

export default AnalyzeButton;

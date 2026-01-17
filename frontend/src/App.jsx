import { useState } from "react";
import FileUploader from "./components/FileUploader";
import AnalyzeButton from "./components/AnalyzeButton";
import LoadingState from "./components/LoadingState";
import RiskDashboard from "./components/results/RiskDashboard";
import DiffList from "./components/results/DiffList";
import SecurityPanel from "./components/SecurityPanel";

function App() {
  const [oldDoc, setOldDoc] = useState(null);
  const [newDoc, setNewDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!oldDoc || !newDoc) {
      setError("Please upload both documents.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("oldDoc", oldDoc);
      formData.append("newDoc", newDoc);

      const response = await fetch("http://localhost:5000/api/analyze-docs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze documents");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>VaultDiff</h1>
      <p>Secure AI Document Change Analyzer</p>

      <FileUploader label="Old Document" onFileSelect={setOldDoc} />
      <FileUploader label="New Document" onFileSelect={setNewDoc} />

      <AnalyzeButton onClick={handleAnalyze} disabled={loading} />

      {loading && <LoadingState />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <>
          <RiskDashboard diffs={result.diffs} />
          <DiffList diffs={result.diffs} />
        </>
      )}

      <SecurityPanel />

    </div>
  );
}

export default App;

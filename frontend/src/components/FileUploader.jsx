function FileUploader({ label, onFileSelect }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        <strong>{label}</strong>
      </label>
      <br />
      <input
        type="file"
        accept=".txt"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
    </div>
  );
}

export default FileUploader;

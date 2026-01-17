import DiffCard from "./DiffCard";

function DiffList({ diffs }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Detected Changes</h3>
      {diffs.map((diff, index) => (
        <DiffCard key={index} diff={diff} />
      ))}
    </div>
  );
}

export default DiffList;

export default function ProgressBar({ percent, onSeek }) {
  return (
    <div
      className="progress"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        onSeek(Math.max(0, Math.min(ratio, 1)));
      }}
    >
      <div className="progressBar" style={{ width: `${percent}%` }} />
    </div>
  );
}

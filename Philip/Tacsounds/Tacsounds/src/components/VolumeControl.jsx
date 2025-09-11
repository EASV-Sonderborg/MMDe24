export default function VolumeControl({
  volume, isMuted, icon, onToggleMute, onChange, vertical=false
}) {
  return (
    <div className={vertical ? "volumeMini" : "volume"} style={{ display:"flex", alignItems:"center", gap:8 }}>
      <button className="muteToggle" onClick={onToggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
        <img src={icon} className="volumeIcon" alt={isMuted ? "Muted" : "Volume"} />
      </button>
      <input
        className={`range ${vertical ? "rangeVertical" : ""}`}
        type="range" min="0" max="1" step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Volume"
        style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` }}
      />
    </div>
  );
}

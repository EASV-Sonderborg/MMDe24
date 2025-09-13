import { useRef, useState, useEffect } from "react";

export default function ProgressBar({ percent, onSeek, className = "" }) {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper: compute 0..1 from an event clientX relative to the bar
  const ratioFromClientX = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(ratio, 1));
    // clamp 0..1
  };

  const handlePointerDown = (e) => {
    // start drag immediately
    e.preventDefault();
    barRef.current.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    onSeek(ratioFromClientX(e.clientX));
  };

  // During drag update the seek
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    onSeek(ratioFromClientX(e.clientX));
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    onSeek(ratioFromClientX(e.clientX));
  };

  // Keyboard bumps still work
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") onSeek(Math.max(0, (percent - 2) / 100));
    if (e.key === "ArrowRight") onSeek(Math.min(1, (percent + 2) / 100));
    if (e.key === "Home") onSeek(0);
    if (e.key === "End") onSeek(1);
  };

  // While dragging, prevent text selection globally (nice UX)
  useEffect(() => {
    if (!isDragging) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = prev;
    };
  }, [isDragging]);

  return (
    <div
      ref={barRef}
      className={`progress ${className} ${isDragging ? "isDragging" : ""}`}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="progressBar" style={{ width: `${percent}%` }} />
    </div>
  );
}

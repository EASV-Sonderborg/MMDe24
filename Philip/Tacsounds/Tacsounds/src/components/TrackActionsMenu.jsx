import React, { useEffect, useMemo, useRef, useState } from "react";
import showMoreIcon from "../assets/icons/showMore.svg";
import "./track-actions-menu.css";

const VIEWPORT_FALLBACK = 1024;

export default function TrackActionsMenu({
  track,
  actions = [],
  triggerClassName = "",
  size = "md",
  align = "right",
  iconOnly = true,
  label = "More options",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const sheetRef = useRef(null);
  const [dropUp, setDropUp] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? VIEWPORT_FALLBACK : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const computedAlign = useMemo(() => align, [align]);

  // Decide whether to drop above or below based on available space
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      try {
        const vpH = typeof window !== "undefined" ? window.innerHeight : 0;
        const triggerRect = containerRef.current?.getBoundingClientRect();
        const sheetEl = sheetRef.current;
        const sheetH = sheetEl ? sheetEl.offsetHeight : 220; // fallback
        if (!triggerRect || !vpH) return;
        const margin = 12;
        const spaceBelow = Math.max(0, vpH - triggerRect.bottom);
        const spaceAbove = Math.max(0, triggerRect.top);
        // Prefer down if there's enough room; otherwise up if it fits better
        const shouldDropUp = spaceBelow < Math.min(sheetH + margin, spaceAbove + 1) && spaceAbove > spaceBelow;
        setDropUp(shouldDropUp);
        // Also clamp max height to available space
        if (sheetEl) {
          const maxH = shouldDropUp ? Math.max(120, spaceAbove - margin) : Math.max(120, spaceBelow - margin);
          sheetEl.style.maxHeight = `${maxH}px`;
          sheetEl.style.overflowY = "auto";
        }
      } catch {}
    };
    const raf = requestAnimationFrame(measure);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer, { passive: true });
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!track || actions.length === 0) return null;

  const onSelect = (action) => {
    action?.onSelect?.(track);
    setOpen(false);
  };

  return (
    <div
      className={`trackMenu trackMenu--${computedAlign} trackMenu--${size} ${open ? "isOpen" : ""}`}
      ref={containerRef}
    >
      <button
        type="button"
        className={`trackMenu__trigger ${triggerClassName}`.trim()}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
      >
        {iconOnly ? <img src={showMoreIcon} alt="" /> : label}
      </button>

      {open && (
        <div
          ref={sheetRef}
          className={`trackMenu__sheet ${dropUp ? "isDropUp" : "isDropDown"}`}
          role="menu"
          style={dropUp ? { bottom: "calc(100% + 10px)", top: "auto" } : { top: "calc(100% + 10px)", bottom: "auto" }}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="trackMenu__item"
              onClick={() => onSelect(action)}
              disabled={action.disabled}
              role="menuitem"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

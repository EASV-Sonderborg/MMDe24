// /src/components/FeaturedCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./carousel.css";

const FALLBACK_COVER = "/assets/covers/tacStandard.png";
const wrap = (i, n) => ((i % n) + n) % n;

// Læs "featured" robust (boolean / number / string / meta.featured)
function trueish(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val > 0;
  const s = String(val).trim().toLowerCase();
  if (!s) return false;
  return s === "true" || s === "1" || s === "yes" || s === "y";
}
const isFeatured = (t) => trueish(t?.featured ?? t?.meta?.featured);

export default function FeaturedCarousel({ controller }) {
  const { tracks = [], isPlaying, playById, current } = controller || {};

  // Kun featured numre – robust filter
  const items = useMemo(() => (tracks || []).filter(isFeatured), [tracks]);
  const n = items.length;

  // Hvis intet at vise → pæn tom-tilstand (men failer ikke)
  if (!n) {
    return (
      <section className="featured">
        <div className="featured__frame">
          <div className="featured__stage">
            <div className="featured__empty">
              Ingen featured tracks endnu…
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback cover, hvis der ikke er et gyldigt src
  const getCoverSrc = (t) => {
    const c = t?.cover;
    if (typeof c === "string" && c.trim()) return c.trim();
    if (c?.src && String(c.src).trim()) return String(c.src).trim();
    return FALLBACK_COVER;
  };

  // Start med “Sunset Skates” centreret, ellers index 0
  const startIndex = useMemo(() => {
    const i = items.findIndex((t) =>
      String(t.title || "").toLowerCase().includes("sunset skates")
    );
    return i === -1 ? 0 : i;
  }, [items]);

  const [center, setCenter] = useState(startIndex);
  const [offsetCards, setOffsetCards] = useState(0); // live drag offset i “kort”

  // Hold center i range hvis data skifter
  useEffect(() => {
    if (center > n - 1) setCenter(0);
  }, [n, center]);

  // Layout/drag indstillinger
  const CARD_W = 200;
  const GAP = 16;
  const SPACING = CARD_W + GAP;

  // DRAG (med live-feed og snap til nærmeste kort)
  const dragRef = useRef({ active: false, startX: 0 });

  const onPointerDown = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current = { active: true, startX: x };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = x - dragRef.current.startX;
    setOffsetCards(dx / SPACING);
  };

  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    window.removeEventListener("pointermove", onPointerMove);
    // Snap til nærmeste kort – tillader at hoppe flere kort, hvis man trak langt
    setCenter((c) => wrap(Math.round(c - offsetCards), n));
    setOffsetCards(0);
  };

  // Keyboard: ←/→ flytter carousel (space håndteres i AudioPlayer)
  useEffect(() => {
    const onKey = (e) => {
      if (!n) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCenter((c) => wrap(c - 1, n));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCenter((c) => wrap(c + 1, n));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  // Beregn visuel placering (cirkulær) for hvert kort
  const cards = useMemo(() => {
    return items.map((t, i) => {
      const rel0 = wrap(i - center, n); // 0..n-1
      const half = Math.floor(n / 2);
      const baseRel = rel0 > half ? rel0 - n : rel0; // fx 6/10 -> -4
      const rel = baseRel + offsetCards;
      const abs = Math.abs(rel);
      const x = rel * SPACING;

      const scale = 1 - Math.min(abs, 2) * 0.25;
      const opacity = 1 - Math.min(abs, 3) * 0.35;
      const z = 100 - abs * 10;

      return {
        i,
        track: t,
        isCenter: Math.round(rel) === 0,
        style: {
          transform: `translate3d(calc(-50% + ${x}px), 0, 0) scale(${scale})`,
          zIndex: Math.round(z),
          opacity,
        },
      };
    });
  }, [items, n, center, offsetCards]);

  const onCardClick = (card) => {
    if (!card.isCenter) {
      setCenter(card.i);
      return;
    }
    playById(card.track.id); // toggle play/pause for center-track
  };

  const isCenterPlaying = (t) => isPlaying && current?.id === t.id;

  const stageWidth = Math.min(window.innerWidth, 1200);
  const stageHeight = 420;

  return (
    <section className="featured">
      <div className="featured__frame" style={{ height: stageHeight }}>
        {/* Pile – cirkulær navigation */}
        <div className="featured__nav">
          <button
            className="featured__arrow"
            onClick={() => setCenter((c) => wrap(c - 1, n))}
            aria-label="Forrige"
          >
            ‹
          </button>
          <button
            className="featured__arrow"
            onClick={() => setCenter((c) => wrap(c + 1, n))}
            aria-label="Næste"
          >
            ›
          </button>
        </div>

        <div
          className="featured__stage"
          style={{ width: stageWidth }}
          onPointerDown={onPointerDown}
          role="group"
          aria-live="polite"
        >
          {items.map((t, i) => {
            const card = cards[i];
            if (!card) return null;
            return (
              <div
                key={t.id || i}
                className={`featured__card ${card.isCenter ? "isCenter" : ""}`}
                style={card.style}
                onClick={() => onCardClick(card)}
              >
                <div className="featured__coverWrap">
                  <div className="featured__cover">
                    <div className="coverBg" />
                    <img
                      src={getCoverSrc(t)}
                      alt={t.title || ""}
                      draggable="false"
                    />
                  </div>

                  <div
                    className={
                      "featured__overlay" +
                      (card.isCenter ? " showOnHover" : "") +
                      (card.isCenter && isCenterPlaying(t) ? " isVisible" : "")
                    }
                  >
                    <svg viewBox="0 0 24 24" className="overlayIcon" aria-hidden>
                      {card.isCenter && isCenterPlaying(t) ? (
                        <g>
                          <rect x="6" y="5" width="4" height="14" />
                          <rect x="14" y="5" width="4" height="14" />
                        </g>
                      ) : (
                        <polygon points="8,5 19,12 8,19" />
                      )}
                    </svg>
                  </div>
                </div>

                <div className="featured__meta">
                  <a className="title" href="#">
                    {t.title}
                  </a>
                  <a className="artist" href="#">
                    {t.artist}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

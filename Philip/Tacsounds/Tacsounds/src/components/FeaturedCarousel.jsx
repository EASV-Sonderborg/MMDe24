import React, { useEffect, useMemo, useRef, useState } from "react";
import "./carousel.css";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function FeaturedCarousel({ controller }) {
  const { tracks = [], index: playingIndex, isPlaying, playById } = controller;

  // which visual card sits in the middle
  const [center, setCenter] = useState(0);

  // keep center in range if data changes
  useEffect(() => {
    if (tracks.length && center > tracks.length - 1) setCenter(0);
  }, [tracks.length]); // eslint-disable-line

  // DRAG STATE
  const dragRef = useRef({ active: false, startX: 0 });
  const [offsetCards, setOffsetCards] = useState(0); // live offset in “card widths”

  // layout
  const CARD_W = 280;
  const GAP = 40;
  const SPACING = CARD_W + GAP;

  // smaller snap threshold -> lighter feel
  const SNAP = 0.5; // ~22% of a card

  const onPointerDown = (e) => {
    if (!tracks.length) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    dragRef.current = { active: true, startX: x };
    // use window so we can drag outside stage
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    const dx = x - dragRef.current.startX;
    setOffsetCards(dx / SPACING);
  };

  const onPointerUp = () => {
    const delta = offsetCards;
    setOffsetCards(0);
    dragRef.current.active = false;
    window.removeEventListener("pointermove", onPointerMove);

    // snap: only move if we passed the smaller threshold
    setCenter((c) => {
      if (Math.abs(delta) < SNAP) return c;
      const target = Math.round(c - delta);
      return clamp(target, 0, tracks.length - 1);
    });
  };

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (!tracks.length) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCenter((c) => clamp(c - 1, 0, tracks.length - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCenter((c) => clamp(c + 1, 0, tracks.length - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tracks, center, playById]);

  // compute transforms
  const cards = useMemo(() => {
    return tracks.map((t, i) => {
      const rel = i - center + offsetCards; // distance in cards from center
      const abs = Math.abs(rel);
      const x = rel * SPACING;

      const scale = 1 - Math.min(abs, 2) * 0.12;
      const opacity = 1 - Math.min(abs, 3) * 0.25;
      const z = 100 - abs * 10;

      return {
        i,
        track: t,
        isCenter: Math.round(rel) === 0,
        style: {
          // anchor every card at the exact middle first, then offset by x
          transform: `translate3d(calc(-50% + ${x}px), 0, 0) scale(${scale})`,
          zIndex: Math.round(z),
          opacity,
        },
      };
    });
  }, [tracks, center, offsetCards]);

  const onCardClick = (card) => {
    if (!card.isCenter) return setCenter(card.i);
    playById(card.track.id);
  };

  const stageWidth = Math.min(window.innerWidth, 1200);
  const stageHeight = 420;

  return (
    <section className="featured">
      <div className="featured__frame" style={{ height: stageHeight }}>
        {/* arrows stay centered with the stage */}
        <div className="featured__nav">
          <button
            className="featured__arrow"
            onClick={() => setCenter((c) => clamp(c - 1, 0, tracks.length - 1))}
            aria-label="Forrige"
          >
            ‹
          </button>
          <button
            className="featured__arrow"
            onClick={() => setCenter((c) => clamp(c + 1, 0, tracks.length - 1))}
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
          {tracks.map((t, i) => {
            const card = cards[i];
            if (!card) return null;
            const thisIsPlaying = i === playingIndex && isPlaying;

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
                    <img src={t.cover?.src} alt="" draggable="false" />
                  </div>

                  <div
                    className={
                      "featured__overlay" +
                      (card.isCenter ? " showOnHover" : "") +
                      (card.isCenter && thisIsPlaying ? " isVisible" : "")
                    }
                  >
                    <svg viewBox="0 0 24 24" className="overlayIcon" aria-hidden>
                      {card.isCenter && thisIsPlaying ? (
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
                  <a className="title" href="#">{t.title}</a>
                  <a className="artist" href="#">{t.artist}</a>
                </div>
              </div>
            );
          })}

          {!tracks.length && <div className="featured__empty">Indlæser…</div>}
        </div>
      </div>
    </section>
  );
}

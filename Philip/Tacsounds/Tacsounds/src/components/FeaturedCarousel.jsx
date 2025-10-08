import React, { useEffect, useMemo, useRef, useState } from "react";
import "./carousel.css";

const FALLBACK_COVER = "/assets/covers/tacStandard.png";
const wrap = (i, n) => ((i % n) + n) % n;

function trueish(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val > 0;
  const s = String(val).trim().toLowerCase();
  if (!s) return false;
  return s === "true" || s === "1" || s === "yes" || s === "y";
}
const isFeatured = (track) => trueish(track?.featured ?? track?.meta?.featured);

export default function FeaturedCarousel({ controller }) {
  const { catalog = [], tracks = [], isPlaying, playById, current } = controller || {};
  // Use the static catalog order so queue changes do not affect carousel order
  const source = catalog && catalog.length ? catalog : tracks;
  const items = useMemo(() => (source || []).filter(isFeatured), [source]);
  const n = items.length;

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth,
  );

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobileView = viewportWidth <= 640;

  if (!n) {
    return (
      <section className="featured">
        <div className="featured__frame">
          <div className="featured__stage">
            <div className="featured__empty">No featured tracks yet.</div>
          </div>
        </div>
      </section>
    );
  }

  const getCoverSrc = (track) => {
    const cover = track?.cover;
    if (typeof cover === "string" && cover.trim()) return cover.trim();
    if (cover?.src && String(cover.src).trim()) return String(cover.src).trim();
    return FALLBACK_COVER;
  };

  const startIndex = useMemo(() => {
    const index = items.findIndex((track) =>
      String(track.title || "")
        .toLowerCase()
        .includes("sunset skates"),
    );
    return index === -1 ? 0 : index;
  }, [items]);

  const [center, setCenter] = useState(startIndex);
  const [offsetCards, setOffsetCards] = useState(0);

  useEffect(() => {
    if (center > n - 1) setCenter(0);
  }, [n, center]);

  const mobileCardSize = Math.min(viewportWidth * 0.78, 320);
  const CARD_W = isMobileView ? mobileCardSize : 400;
  const CARD_GAP = isMobileView ? Math.max(mobileCardSize * 0.12, 14) : 16;
  const MOBILE_PEEK = isMobileView ? Math.max(12, CARD_GAP * 0.65) : 0;
  const BASE_SPACING = CARD_W + CARD_GAP;
  const VISUAL_SPACING = isMobileView ? BASE_SPACING * 0.78 : BASE_SPACING;

  const dragRef = useRef({
    active: false,
    startX: 0,
    offset: 0,
    blockClick: false,
    cleanup: null,
    spacing: BASE_SPACING || 1,
  });

  useEffect(() => {
    return () => {
      if (dragRef.current.cleanup) {
        dragRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    dragRef.current.spacing = BASE_SPACING || 1;
  }, [BASE_SPACING]);

  const onPointerDown = (event) => {
    if (dragRef.current.active) {
      dragRef.current.cleanup?.();
      dragRef.current.active = false;
    }

    if (event.button !== undefined && event.button !== 0) return;

    event.stopPropagation();

    const pointerType = event.pointerType;
    if (pointerType && pointerType !== "mouse" && event.cancelable) {
      event.preventDefault();
    }

    const x =
      event.clientX ?? event.touches?.[0]?.clientX ?? dragRef.current.startX;

    const state = dragRef.current;
    state.active = true;
    state.startX = x;
    state.offset = 0;
    state.blockClick = false;
    state.spacing = BASE_SPACING || 1;

    const handleMove = (moveEvent) => {
      const currentState = dragRef.current;
      if (!currentState.active) return;
      const moveX =
        moveEvent.clientX ??
        moveEvent.touches?.[0]?.clientX ??
        currentState.startX;
      const dx = moveX - currentState.startX;
      const spacing = currentState.spacing || BASE_SPACING || 1;
      const ratio = spacing ? dx / spacing : 0;
      currentState.offset = ratio;
      if (!currentState.blockClick && Math.abs(ratio) > 0.12) {
        currentState.blockClick = true;
      }
      setOffsetCards(ratio);
    };

    const endDrag = () => {
      const currentState = dragRef.current;
      if (!currentState.active) return;

      cleanup();

      const offset = currentState.offset;
      const shouldBlockClick = currentState.blockClick || Math.abs(offset) > 0.2;

      if (shouldBlockClick) {
        currentState.blockClick = true;
        setTimeout(() => {
          dragRef.current.blockClick = false;
        }, 0);
      } else {
        currentState.blockClick = false;
      }

      currentState.active = false;
      currentState.offset = 0;
      currentState.cleanup = null;

      setCenter((c) => wrap(Math.round(c - offset), n));
      setOffsetCards(0);
    };

    const wrappedEnd = () => endDrag();

    function cleanup() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", wrappedEnd);
      window.removeEventListener("pointercancel", wrappedEnd);
      dragRef.current.cleanup = null;
    }

    state.cleanup = cleanup;

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerup", wrappedEnd, { once: true });
    window.addEventListener("pointercancel", wrappedEnd, { once: true });
  };

  const onCardClick = (card) => {
    if (dragRef.current.blockClick) return;
    if (!card.isCenter) {
      setCenter(card.index);
      return;
    }
    playById?.(card.track.id);
  };

  const cards = useMemo(() => {
    const maxVisibleDistance = isMobileView ? 1.6 : 3;
    return items.map((track, index) => {
      const rel0 = wrap(index - center, n);
      const half = Math.floor(n / 2);
      const baseRel = rel0 > half ? rel0 - n : rel0;
      const rel = baseRel + offsetCards;
      const abs = Math.abs(rel);
      const effectiveRel = isMobileView
        ? Math.max(Math.min(rel, maxVisibleDistance), -maxVisibleDistance)
        : rel;
      const x = effectiveRel * VISUAL_SPACING;

      const scale = isMobileView
        ? 1 - Math.min(abs, 1) * 0.12
        : 1 - Math.min(abs, 2) * 0.25;
      const opacityBase = isMobileView
        ? 1 - Math.min(abs, 1) * 0.4
        : 1 - Math.min(abs, 3) * 0.35;
      const hidden = isMobileView && abs > maxVisibleDistance;
      const opacity = hidden ? 0 : Math.max(0, opacityBase);
      const zIndex = 100 - abs * 10;
      const isCurrentCard = current?.id === track.id;
      const isActiveCard = isCurrentCard && isPlaying;
      return {
        index,
        track,
        isCenter: Math.round(rel) === 0,
        isCurrent: isCurrentCard,
        isPlaying: isActiveCard,
        isPeek: isMobileView && !hidden && abs > 0,
        isHidden: hidden,
        style: {
          transform: `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`,
          zIndex: Math.round(zIndex),
          opacity,
          visibility: hidden ? "hidden" : "visible",
          pointerEvents: hidden ? "none" : "auto",
        },
      };
    });
  }, [
    items,
    n,
    center,
    offsetCards,
    current?.id,
    VISUAL_SPACING,
    isMobileView,
    isPlaying,
  ]);

  const stageWidth = isMobileView
    ? Math.max(0, viewportWidth - MOBILE_PEEK * 2)
    : Math.min(Math.max(viewportWidth - 64, CARD_W + CARD_GAP * 2), 1200);
  const stageHeight = isMobileView ? CARD_W + 120 : 420;
  const sectionClassName = `featured ${isMobileView ? "featured--mobile" : ""}`;
  const sectionStyle = isMobileView
    ? {
        "--featured-card-size": `${CARD_W}px`,
        "--featured-card-gap": `${CARD_GAP}px`,
        "--featured-card-peek": `${MOBILE_PEEK}px`,
      }
    : undefined;



  return (
    <section className={sectionClassName} style={sectionStyle}>
      <div className="featured__frame" style={{ height: stageHeight }}>
        <div className="featured__nav">
          <button
            className="featured__arrow featured__arrow--prev"
            onClick={() => setCenter((c) => wrap(c - 1, n))}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            className="featured__arrow featured__arrow--next"
            onClick={() => setCenter((c) => wrap(c + 1, n))}
            aria-label="Next"
          >
            →
          </button>
        </div>

        <div
          className="featured__stage"
          style={{ width: stageWidth, height: stageHeight }}
          onPointerDown={onPointerDown}
          role="group"
          aria-live="polite"
        >
          {cards.map((card) => {
            const { track } = card;
            const overlayClass = [
              "featured__overlay",
              card.isCenter ? "showOnHover" : "",
              card.isPlaying ? "isVisible" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div
                key={track.id || card.index}
                className={`featured__card ${card.isCenter ? "isCenter" : ""} ${
                  card.isCurrent ? "isCurrent" : ""
                } ${card.isPlaying ? "isPlaying" : ""} ${
                  card.isPeek ? "isPeek" : ""
                } ${card.isHidden ? "isHidden" : ""}`}
                style={card.style}
                aria-hidden={card.isHidden || undefined}
                onClick={() => onCardClick(card)}
                onPointerDown={onPointerDown}
              >
                <div className="featured__coverWrap">
                  <div className="featured__cover">
                    <div className="coverBg" />
                    <img
                      src={getCoverSrc(track)}
                      alt={track.title || ""}
                      draggable="false"
                    />
                  </div>

                  <div className={overlayClass}>
                    <svg
                      viewBox="0 0 24 24"
                      className="overlayIcon"
                      aria-hidden
                    >
                      {card.isPlaying ? (
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
                  <span className="title">{track.title}</span>
                  <span className="artist">{track.artist}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

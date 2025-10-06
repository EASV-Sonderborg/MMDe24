import React from "react";
import controlPlay from "../assets/icons/play.svg";
import "./queue.css";

const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 5l-7 7h4v7h6v-7h4z" fill="currentColor" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 19l7-7h-4V5h-6v7H5z" fill="currentColor" />
  </svg>
);

export default function QueueModal({ isOpen, onClose, controller }) {
  if (!isOpen) return null;

  const {
    queueTracks = [],
    queueIndex = 0,
    playById,
    moveInQueue,
    removeFromQueue,
  } = controller || {};

  return (
    <div className="queueModal__backdrop" onClick={onClose}>
      <div className="queueModal" onClick={(event) => event.stopPropagation()}>
        <header className="queueModal__header">
          <h2>Queue</h2>
          <button
            type="button"
            className="queueModal__close"
            onClick={onClose}
            aria-label="Close queue"
          >
            ×
          </button>
        </header>

        <div className="queueModal__list">
          {queueTracks.length === 0 ? (
            <p className="queueModal__empty">Queue is empty.</p>
          ) : (
            queueTracks.map((track, index) => {
              const isCurrent = index === queueIndex;
              return (
                <div
                  key={track.id}
                  className={`queueItem ${isCurrent ? "isCurrent" : ""}`}
                >
                  {track.cover?.src ? (
                    <img className="queueItem__cover" src={track.cover.src} alt="" />
                  ) : (
                    <div className="queueItem__cover queueItem__cover--placeholder" />
                  )}

                  <div className="queueItem__meta">
                    <div className="queueItem__title">{track.title}</div>
                    <div className="queueItem__artist">{track.artist}</div>
                  </div>

                  <div className="queueItem__actions">
                    <button
                      type="button"
                      className="queueBtn queueBtn--play"
                      onClick={() => playById?.(track.id)}
                      title="Play"
                      aria-label="Play this track"
                    >
                      <img src={controlPlay} alt="" />
                    </button>
                    <button
                      type="button"
                      className="queueBtn"
                      onClick={() => moveInQueue?.(track.id, "up")}
                      disabled={index === 0}
                      title="Move up"
                      aria-label="Move track up"
                    >
                      <ArrowUpIcon />
                    </button>
                    <button
                      type="button"
                      className="queueBtn"
                      onClick={() => moveInQueue?.(track.id, "down")}
                      disabled={index === queueTracks.length - 1}
                      title="Move down"
                      aria-label="Move track down"
                    >
                      <ArrowDownIcon />
                    </button>
                    <button
                      type="button"
                      className="queueBtn queueBtn--remove"
                      onClick={() => removeFromQueue?.(track.id)}
                      disabled={queueTracks.length <= 1}
                      title="Remove from queue"
                      aria-label="Remove track from queue"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
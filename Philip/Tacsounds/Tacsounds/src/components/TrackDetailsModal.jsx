import React from "react";

const FALLBACK_COVER = "/assets/covers/tacStandard.png";

export default function TrackDetailsModal({
  track,
  onClose,
  durationLabel,
  normalizeGenres,
  fmtDate,
}) {
  if (!track) return null;

  const genres = normalizeGenres ? normalizeGenres(track) : track.genres || [];
  const coverSrc = track.cover?.src || FALLBACK_COVER;
  const release = fmtDate
    ? fmtDate(track.releaseDate)
    : track.releaseDate || "--";
  const duration = durationLabel || track.length || track.duration || "--";
  const bpm = track.bpm || "--";

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalCard" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modalClose"
          aria-label="Close"
          onClick={onClose}
        >
          x
        </button>

        <div className="modalGrid">
          <img className="modalCover" src={coverSrc} alt="" />
          <div className="modalMeta">
            <h2>{track.title}</h2>
            <div className="modalArtist">{track.artist}</div>

            <div className="modalList">
              <div>
                <span>Album:</span> {track.album || "--"}
              </div>
              <div>
                <span>Genre:</span> {genres.join(", ") || "--"}
              </div>
              <div>
                <span>Released:</span> {release}
              </div>
              <div>
                <span>Length:</span> {duration}
              </div>
              <div>
                <span>BPM:</span> {bpm}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "./ProjectModal.css";

export default function ProjectModal({
  projects,
  index,
  onClose,
  onPrev,
  onNext,
  toolIcons = {},
}) {
  const p = projects[index];
  const overlayRef = useRef(null);
  const [active, setActive] = useState(0); // galleri index

  // ESC / piletaster + scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < projects.length - 1) onNext();
      if (e.key === "ArrowLeft" && index > 0) onPrev();
    };
    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [index, projects.length, onClose, onNext, onPrev]);

  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const gallery = p.gallery?.length ? p.gallery : [p.thumb];

  return (
    <div
      className="pm__overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      onMouseDown={onBackdropClick}
    >
      {index > 0 && (
        <button className="pm__nav pm__nav--prev" onClick={onPrev} aria-label="Forrige projekt">❮</button>
      )}

      <div className="pm__dialog glass">
        <button className="pm__close" onClick={onClose} aria-label="Luk">✕</button>


    <div className="pm__media">
    <div className="pm__stage">
        {/* venstre/højre pile */}
        {gallery.length > 1 && (
        <button
            className="pm__imgNav pm__imgNav--prev"
            onClick={() => setActive((a) => (a - 1 + gallery.length) % gallery.length)}
            aria-label="Forrige billede"
        >
            ❮
        </button>
        )}
        {gallery.length > 1 && (
        <button
            className="pm__imgNav pm__imgNav--next"
            onClick={() => setActive((a) => (a + 1) % gallery.length)}
            aria-label="Næste billede"
        >
            ❯
        </button>
        )}

        {/* selve billedet */}
        <img
        src={gallery[active].src || gallery[active]}
        alt={gallery[active].title || ""}
        />
    </div>

    {/* titel + beskrivelse */}
    {(gallery[active].title || gallery[active].desc) && (
        <div className="pm__caption">
        {gallery[active].title && (
            <h5 className="pm__imgTitle text__subtitle">{gallery[active].title}</h5>
        )}
        {gallery[active].desc && (
            <p className="pm__imgDesc text__body">{gallery[active].desc}</p>
        )}
        </div>
    )}

    {/* thumbs */}
    {gallery.length > 1 && (
        <div className="pm__thumbs">
        {gallery.map((img, i) => (
            <button
            key={img.src || img}
            className={`pm__thumb ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Billede ${i + 1}`}
            >
            <img src={img.src || img} alt="" />
            </button>
        ))}
        </div>
    )}
    </div>


        {/* BUND – to kolonner */}
        <div className="pm__bottom">
          {/* Venstre side: titel + tekst + proces */}
          <div className="pm__left">
            <h3 className="pm__title text__title">{p.title}</h3>
            {p.subtitle && <p className="pm__subtitle text__label">{p.subtitle}</p>}
            {p.description && <p className="pm__desc text__body">{p.description}</p>}

          </div>

          {/* Højre side: værktøjer, roller, dato + knapper */}
          <div className="pm__right">
            <div className="pm__meta">
              {p.role?.length > 0 && (
                <div className="pm__row">
                  <span className="pm__key">Rolle:</span>
                  <div className="pm__chips">
                    {p.role.map((r) => (
                      <span
                        key={r}
                        className={`pill ${r.toLowerCase()==='design' ? 'pill--design' : 'pill--dev'}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.tools?.length > 0 && (
                <div className="pm__row">
                  <span className="pm__key">Værktøjer:</span>
                  <div className="pm__tools">
                    {p.tools.map((k) => {
                      const src = toolIcons[k];
                      return src
                        ? <img key={k} src={src} alt={k} title={k} />
                        : <span key={k} className="pm__dot" />;
                    })}
                  </div>
                </div>
              )}

              {p.date && (
                <div className="pm__row">
                  <span className="pm__key">Dato:</span>
                  <span className="pill pill--date">{p.date}</span>
                </div>
              )}
            </div>

            {(p.siteUrl || p.repoUrl) && (
              <div className="pm__actions glass">
                {/* Vises kun hvis der ER et site-link */}
                {p.siteUrl && (
                  <a href={p.siteUrl} className="btn btn--light text__body" target="_blank" rel="noreferrer">
                    Besøg siden
                  </a>
                )}
                {p.repoUrl && (
                  <a href={p.repoUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {index < projects.length - 1 && (
        <button className="pm__nav pm__nav--next" onClick={onNext} aria-label="Næste projekt">❯</button>
      )}
    </div>
  );
}

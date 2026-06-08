import { useEffect, useRef, useState } from "react";
import "./ProjectModal.css";

export default function ProjectModal({ projects, index, onClose, onPrev, onNext, toolIcons = {} }) {
  const project = projects[index];
  const overlayRef = useRef(null);
  const [active, setActive] = useState(0);
  const gallery = project.gallery?.length ? project.gallery : [project.thumb];

  useEffect(() => {
    setActive(0);
  }, [index]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && index < projects.length - 1) onNext();
      if (event.key === "ArrowLeft" && index > 0) onPrev();
    };
    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [index, projects.length, onClose, onNext, onPrev]);

  const activeImage = gallery[active];
  const activeSource = activeImage.src || activeImage;

  return (
    <div
      className="pm__overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      {index > 0 && <button className="pm__nav pm__nav--prev" onClick={onPrev} aria-label="Forrige projekt">‹</button>}

      <div className="pm__dialog glass">
        <button className="pm__close" onClick={onClose} aria-label="Luk">×</button>
        <div className="pm__media">
          <div className="pm__stage">
            {gallery.length > 1 && (
              <>
                <button className="pm__imgNav pm__imgNav--prev" onClick={() => setActive((active - 1 + gallery.length) % gallery.length)} aria-label="Forrige billede">‹</button>
                <button className="pm__imgNav pm__imgNav--next" onClick={() => setActive((active + 1) % gallery.length)} aria-label="Næste billede">›</button>
              </>
            )}
            <img src={activeSource} alt={activeImage.title || `Billede fra ${project.title}`} />
          </div>

          {(activeImage.title || activeImage.desc) && (
            <div className="pm__caption">
              {activeImage.title && <h5 className="pm__imgTitle text__subtitle">{activeImage.title}</h5>}
              {activeImage.desc && <p className="pm__imgDesc text__body">{activeImage.desc}</p>}
            </div>
          )}

          {gallery.length > 1 && (
            <div className="pm__thumbs">
              {gallery.map((image, imageIndex) => (
                <button
                  key={image.src || image}
                  className={`pm__thumb ${imageIndex === active ? "is-active" : ""}`}
                  onClick={() => setActive(imageIndex)}
                  aria-label={`Billede ${imageIndex + 1}`}
                >
                  <img src={image.src || image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pm__bottom">
          <div className="pm__left">
            <h3 className="pm__title text__title">{project.title}</h3>
            <p className="pm__subtitle text__label">{project.subtitle}</p>
            <p className="pm__desc text__body">{project.description}</p>
          </div>

          <div className="pm__right">
            <div className="pm__meta">
              <div className="pm__row"><span className="pm__key">Rolle:</span><div className="pm__chips">{project.role.map((role) => <span key={role} className="pill">{role}</span>)}</div></div>
              <div className="pm__row"><span className="pm__key">Værktøjer:</span><div className="pm__tools">{project.tools.map((key) => toolIcons[key] && <img key={key} src={toolIcons[key]} alt={key} />)}</div></div>
              <div className="pm__row"><span className="pm__key">Dato:</span><span className="pill pill--date">{project.date}</span></div>
            </div>
            {project.siteUrl && <a href={project.siteUrl} className="btn btn--light" target="_blank" rel="noreferrer">Besøg siden</a>}
          </div>
        </div>
      </div>

      {index < projects.length - 1 && <button className="pm__nav pm__nav--next" onClick={onNext} aria-label="Næste projekt">›</button>}
    </div>
  );
}

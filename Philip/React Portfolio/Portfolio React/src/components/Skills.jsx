import { useEffect, useRef } from "react";
import { skills } from "../data/skills";   // husk at ikoner i skills.js er IMPORTERET
import "./skills.css";

const Dots = ({ level, max = 5 }) => (
  <div className="skill__dots" aria-label={`Niveau ${level} af ${max}`}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={`dot ${i < level ? "dot--filled" : ""}`} />
    ))}
  </div>
);

export default function Skills() {
  const cardRefs = useRef([]);

  useEffect(() => {
    // fallback: hvis ref-callbacks ikke har udfyldt alt endnu
    if (!cardRefs.current.length) {
      cardRefs.current = Array.from(document.querySelectorAll(".skillCard"));
    }

    let raf = 0;
    const R = 220; // rækkevidde udenfor kortet hvor highlight stadig påvirker

    const update = (x, y) => {
      if (x == null || y == null) return;

      cardRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();

        // musens position relativt til kortet (kan være udenfor)
        const px = x - r.left;
        const py = y - r.top;

        // afstand til nærmeste punkt på kortets kant (0 = ved kanten/indenfor)
        const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        const dist = Math.hypot(dx, dy);

        const t = Math.max(0, 1 - dist / R); // 0..1

        el.style.setProperty("--mx", `${px}px`);
        el.style.setProperty("--my", `${py}px`);
        el.style.setProperty("--intensity", t.toFixed(3));
      });
    };

    const onPointer = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? e.changedTouches?.[0]?.clientY;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(x, y));
    };

    const onLeave = () => {
      cardRefs.current.forEach((el) => el?.style.setProperty("--intensity", "0"));
    };

    // lyt bredt for stabilitet
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("mousemove", onPointer, { passive: true });
    window.addEventListener("touchmove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("mouseout", (e) => { if (!e.relatedTarget) onLeave(); });

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("mousemove", onPointer);
      window.removeEventListener("touchmove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("mouseout", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="skills" className="skills">
      <h2 className="text__title">Egenskaber</h2>

      {skills.map((group, gi) => (
        <div key={group.category} className="skills__group">
          <h3 className="text__subtitle">{group.category}</h3>
          <div className="skills__grid">
            {group.items
              .filter((i) => !i.placeholder)
              .map((item, i) => (
                <article
                  key={item.name}
                  ref={(el) => (cardRefs.current[`${gi}-${i}`] = el)}
                  className={`skillCard glass skillCard--${group.theme}`}
                >
                  <header className="skillCard__head">
                    <img src={item.icon} alt="" aria-hidden="true" />
                    <span className="skillCard__code">&lt;/&gt;</span>
                  </header>
                  <div className="skillCard__body">
                    <h4 className="text__cardTitle">{item.name}</h4>
                    <Dots level={item.level} />
                  </div>
                </article>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

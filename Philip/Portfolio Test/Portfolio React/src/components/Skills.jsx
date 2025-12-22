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
  const cardRefs = useRef({});

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
                  </div>
                </article>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

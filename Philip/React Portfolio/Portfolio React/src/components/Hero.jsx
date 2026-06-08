import logo__html from '../assets/logo__html.svg';
import logo__css from '../assets/logo__css.svg';
import logo__js from '../assets/logo__js.svg';
import logo__react from '../assets/logo__react.svg';

const heroTools = [
  ['HTML', logo__html],
  ['CSS', logo__css],
  ['JavaScript', logo__js],
  ['React', logo__react],
];

export default function Hero() {
  return (
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero__status">
        <span aria-hidden="true" />
        Frontend · Design · Development
      </div>

      <div className="hero__content">
        <p className="eyebrow">Portfolio 2026</p>
        <h1 id="hero-title" className="hero__title text__display">PHILIP BRINCK</h1>
        <p className="hero__subtitle text__subtitle">Front-end Web Developer</p>
        <p className="hero__intro">
          Jeg skaber brugervenlige websites, hvor et roligt visuelt udtryk møder
          solid frontend-udvikling.
        </p>
      </div>

      <ul className="hero__skillset" aria-label="Primære frontend-teknologier">
        {heroTools.map(([name, icon]) => (
          <li key={name}>
            <img src={icon} alt="" aria-hidden="true" />
            <span>{name}</span>
          </li>
        ))}
      </ul>

      <div className="hero__actions">
        <a className="hero__cta" href="mailto:philip-brinck@hotmail.dk">Skriv til mig</a>
        <a className="hero__project-link" href="#projects">Se projekter</a>
      </div>

      <a href="#projects" className="hero__scroll" aria-label="Scroll til projekter">
        <span>Scroll for at læse mere</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </section>
  );
}

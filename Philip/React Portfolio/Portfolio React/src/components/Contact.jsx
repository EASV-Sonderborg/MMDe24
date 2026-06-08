import logo__linkedin from '../assets/logo__linkedin.svg';
import logo__github from '../assets/logo__github.svg';

export default function Contact() {
  return (
    <footer id="contact" className="contact">
      <div className="contact__inner" data-reveal>
        <h2 className="text__subtitle">Skal vi arbejde sammen?</h2>
        <p className="text__label">Kontakt mig her</p>
        <div className="contact__list">
          <a className="contact__link" href="mailto:philip-brinck@hotmail.dk">
            Philip-brinck@hotmail.dk
          </a>
          <div className="contact__iconlist">
            <a aria-label="Besøg Philip på GitHub" className="contact__icon" href="https://github.com/Philip1911" target="_blank" rel="noopener noreferrer">
              <img src={logo__github} alt="" />
            </a>
            <a aria-label="Besøg Philip på LinkedIn" className="contact__icon" href="https://www.linkedin.com/in/philip-brinck-123456789" target="_blank" rel="noopener noreferrer">
              <img src={logo__linkedin} alt="" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

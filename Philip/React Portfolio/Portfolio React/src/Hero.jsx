import logo__html from './assets/logo__html.png';
import logo__css from './assets/logo__css.png';
import logo__js from './assets/logo__js.png';
import logo__react from './assets/logo__react.png';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title text__display">PHILIP BRINCK</h1>
        <p className="hero__subtitle">Front-end Web Developer</p>
      </div>
      <div className="hero__skillset">
        <img src={logo__html} alt="skill__logo" />
        <img src={logo__css} alt="skill__logo" />
        <img src={logo__js} alt="skill__logo" />
        <img src={logo__react} alt="skill__logo" />
      </div>
      <div className='hero__contact'>
        <p className='text__body'>Skal vi arbejde sammen? Skriv til mig her</p>
        <a className='contact__link glass' href="mailto: philip-brinck@hotmail.dk">Philip-brinck@hotmail.dk</a>
      </div>
    </section>
  );
}
export default Hero;
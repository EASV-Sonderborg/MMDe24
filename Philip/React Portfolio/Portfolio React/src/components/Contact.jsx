import logo__linkedin from '../assets/logo__linkedin.svg';
import logo__github from '../assets/logo__github.svg';


function Contact() {
  return (
    <section id="contact" className="contact">
      <h2 className="text__subtitle">Kontakt</h2>
      <p className='text__label'>Kontakt mig her:</p>
      <section className="contact__list">
        <a className='contact__link glass text__title' href="mailto: philip-brinck@hotmail.dk">Philip-brinck@hotmail.dk</a>
        <div className='contact__iconlist'>
          <a className='contact__icon' href="https://github.com/Philip1911" target="_blank" rel="noopener noreferrer"><img src={logo__github} alt="Github link" /></a>
          <a className='contact__icon' href="https://www.linkedin.com/in/philip-brinck-123456789" target="_blank" rel="noopener noreferrer"><img src={logo__linkedin} alt="Linkedin link" /></a>
        </div>
  
      </section>
    </section>
    )};

    export default Contact;

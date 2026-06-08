import { skills } from '../data/skills';
import { education, experience, profile } from '../data/profileData';

function getAge(birthDate) {
  const today = new Date();
  const [year, month, day] = birthDate.split('-').map(Number);
  let age = today.getFullYear() - year;

  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age -= 1;
  }

  return age;
}

function Timeline({ title, items }) {
  return (
    <section className="about__timeline" aria-labelledby={`timeline-${title}`}>
      <h4 id={`timeline-${title}`}>{title}</h4>
      <ol>
        {items.map((item) => (
          <li key={`${item.period}-${item.title}`}>
            <span className="about__timeline-dot" aria-hidden="true" />
            <time>{item.period}</time>
            <strong>{item.title}</strong>
            <span>{item.organization}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProfileImage() {
  if (profile.image) {
    return <img src={profile.image} alt={`Portræt af ${profile.name}`} />;
  }

  return (
    <svg viewBox="0 0 240 240" aria-hidden="true">
      <circle cx="120" cy="82" r="50" />
      <path d="M42 219c8-59 37-87 78-87s70 28 78 87" />
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className="about section-shell" aria-labelledby="about-title">
      <div className="section-heading" data-reveal="motion" data-reveal-direction="up">
        <p className="eyebrow">Lidt om mig</p>
        <h2 id="about-title" className="text__title">About Me</h2>
      </div>

      <div className="about__grid">
        <aside className="about__profile glass-card" data-reveal="motion" data-reveal-direction="left">
          <div className="about__profile-head">
            <div className="about__avatar" role={profile.image ? undefined : 'img'} aria-label={profile.image ? undefined : 'Profilillustration af Philip'}>
              <ProfileImage />
            </div>
            <div>
              <p className="eyebrow">{profile.role}</p>
              <h3>{profile.name}</h3>
              <dl className="about__facts">
                <div><dt>Alder</dt><dd>{getAge(profile.birthDate)} år</dd></div>
                <div>
                  <dt>Lokation</dt>
                  <dd><span className="about__flag" role="img" aria-label="Danmarks flag">🇩🇰</span>{profile.location}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="about__journey">
            <Timeline title="Uddannelse" items={education} />
            <Timeline title="Erfaring" items={experience} />
          </div>
        </aside>

        <div className="about__content">
          <article className="about__story glass-card" data-reveal="motion" data-reveal-direction="right">
            <p className="eyebrow">Frontend Developer</p>
            <h3>Jeg bygger <strong>Digitale Oplevelser</strong> med fokus på mennesker.</h3>
            <p>
              Som Multimediedesigner kombinerer jeg <strong>Frontend Udvikling</strong>,
              visuelt <strong>Design</strong> og brugerforståelse for at omsætte idéer
              til gennemarbejdede digitale løsninger.
            </p>
            <p>
              Jeg arbejder struktureret fra koncept og prototype til responsiv
              implementering. Mit mål er at skabe <strong>Brugervenlige Websites</strong>,
              hvor tydelig kommunikation, stærk visuel identitet og
              <strong> Funktionel Kode</strong> hænger naturligt sammen.
            </p>
            <p>
              Nysgerrighed på nye <strong>Teknologier</strong> og arbejdsmetoder driver
              mig til løbende at udvikle både mine tekniske og kreative kompetencer.
            </p>
          </article>

          <article id="skills" className="about__skills glass-card" aria-labelledby="skills-title" data-reveal="motion" data-reveal-direction="up">
            <header className="about__skills-heading">
              <div>
                <p className="eyebrow">Værktøjer og teknologier</p>
                <h3 id="skills-title">Egenskaber</h3>
              </div>
            </header>

            <ul className="about__skill-showcase">
              {skills.map((item) => (
                <li key={item.name}>
                  <span className="about__skill-icon">
                    <img src={item.icon} alt="" aria-hidden="true" />
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

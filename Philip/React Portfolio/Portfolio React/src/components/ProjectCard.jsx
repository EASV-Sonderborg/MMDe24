import logo__html from '../assets/logo__html.svg';
import logo__css from '../assets/logo__css.svg';
import logo__js from '../assets/logo__js.svg';
import logo__react from '../assets/logo__react.svg';
import logo__photoshop from '../assets/logo__photoshop.svg';
import logo__figma from '../assets/logo__figma.svg';
import logo__wordpress from '../assets/logo__wordpress.svg';

const toolIcons = {
  html: logo__html,
  css: logo__css,
  js: logo__js,
  react: logo__react,
  photoshop: logo__photoshop,
  figma: logo__figma,
  wordpress: logo__wordpress,
};

const toolNames = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  react: 'React',
  photoshop: 'Photoshop',
  figma: 'Figma',
  wordpress: 'WordPress',
};

export default function ProjectCard({ project, index, flip = false, isActive, onOpen }) {
  return (
    <article
      className={`projectShowcase ${flip ? 'projectShowcase--flip' : ''} ${isActive ? 'is-active' : ''}`}
      aria-labelledby={`project-title-${project.id}`}
    >
      <div className="projectShowcase__media">
        <span className="projectShowcase__number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <img src={project.thumb} alt={`Forhåndsvisning af ${project.title}`} loading="lazy" />
      </div>

      <div className="projectShowcase__content">
        <div>
          <p className="eyebrow">{project.subtitle} · {project.date}</p>
          <h3 id={`project-title-${project.id}`}>{project.title}</h3>
          <p className="projectShowcase__description">{project.description}</p>
        </div>

        <div className="projectShowcase__details">
          <div>
            <span className="projectShowcase__label">Rolle</span>
            <ul className="projectShowcase__tags" aria-label="Projektroller">
              {project.role.map((role) => <li key={role}>{role}</li>)}
            </ul>
          </div>

          <div>
            <span className="projectShowcase__label">Teknologier</span>
            <ul className="projectShowcase__tools" aria-label="Projektteknologier">
              {project.tools.map((key) => (
                <li key={key}>
                  <img src={toolIcons[key]} alt="" aria-hidden="true" />
                  <span>{toolNames[key] || key}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="projectShowcase__actions">
          <button type="button" className="projectAction projectAction--primary" onClick={onOpen}>
            View Case Study
          </button>
          {project.siteUrl && (
            <a className="projectAction projectAction--secondary" href={project.siteUrl} target="_blank" rel="noreferrer">
              Live Site
            </a>
          )}
          {project.repoUrl && (
            <a className="projectAction projectAction--secondary" href={project.repoUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// src/components/ProjectCard.jsx
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

export default function ProjectCard({ project, flip = false }) {
  return (
    <article id='projects' className={`projectCard ${flip ? 'projectCard--flip' : ''}`}>
      <div className="projectCard__media">
        <img src={project.thumb} alt="" loading="lazy" />
        <div className="projectCard__mediaOverlay">
          {project.demoUrl && (
            <a href={project.demoUrl} className="btn btn--light" target="_blank" rel="noreferrer">Demo</a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">GitHub</a>
          )}
        </div>
      </div>

      <div className="projectCard__body">
        <h3 className="text__cardTitle">{project.title}</h3>
        <p className="text__label">{project.subtitle}</p>
        <p className="text__body projectCard__desc">{project.description}</p>

        <hr className="projectCard__rule" />

        {/* META BAR */}
        <div className="projectMeta">
          <div className="metaGroup">
            <span className="metaLabel text__label">Rolle:</span>
            <div className="chips">
              {project.role.map(r => (
                <span
                  key={r}
                  className={` pill text__label ${r.toLowerCase()==='design' ? 'pill--design' : 'pill--dev'}`}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="metaGroup">
            <span className="metaLabel text__label">Værktøjer:</span>
            <div className="toolsRow">
              {project.tools.map(key => (
                <img
                  key={key}
                  className="toolIcon"
                  src={toolIcons[key]}
                  alt={key}
                  title={key}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className="metaGroup metaGroup--date">
            <span className="metaLabel text__label">Dato:</span>
            <span className="pill pill--date  text__body">{project.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

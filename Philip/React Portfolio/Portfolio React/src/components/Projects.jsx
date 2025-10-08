// src/sections/Projects.jsx
import { useMemo, useState } from "react";
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { projects } from '../data/projectsData';
import './projects.css';

// tool-icons (samme som i ProjectCard)
import logo__html from '../assets/logo__html.svg';
import logo__css from '../assets/logo__css.svg';
import logo__js from '../assets/logo__js.svg';
import logo__react from '../assets/logo__react.svg';
import logo__photoshop from '../assets/logo__photoshop.svg';
import logo__figma from '../assets/logo__figma.svg';
import logo__wordpress from '../assets/logo__wordpress.svg';

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(null);

  const toolIcons = useMemo(() => ({
    html: logo__html,
    css: logo__css,
    js: logo__js,
    react: logo__react,
    photoshop: logo__photoshop,
    figma: logo__figma,
    wordpress: logo__wordpress,
  }), []);

  const openAt = (i) => setOpenIndex(i);
  const close  = () => setOpenIndex(null);
  const next   = () => setOpenIndex((i) => Math.min(projects.length - 1, i + 1));
  const prev   = () => setOpenIndex((i) => Math.max(0, i - 1));

  return (
    <section id="projects" className="projects">
      <h2 className="text__title">Projekter</h2>

      <div className="projects__list">
        {projects.map((p, i) => (
          <div key={p.id} onClick={() => openAt(i)} style={{ cursor: 'pointer' }}>
            <ProjectCard project={p} flip={i % 2 === 1} />
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <ProjectModal
          projects={projects}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
          toolIcons={toolIcons}
        />
      )}
    </section>
  );
}

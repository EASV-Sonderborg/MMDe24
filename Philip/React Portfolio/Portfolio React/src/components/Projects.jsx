// src/sections/Projects.jsx
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projectsData';
import './projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <h2 className="text__title">Projekter</h2>

      <div className="projects__list">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

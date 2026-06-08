import { useEffect, useMemo, useRef, useState } from "react";
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { projects } from '../data/projectsData';
import './projects.css';

import logo__html from '../assets/logo__html.svg';
import logo__css from '../assets/logo__css.svg';
import logo__js from '../assets/logo__js.svg';
import logo__react from '../assets/logo__react.svg';
import logo__photoshop from '../assets/logo__photoshop.svg';
import logo__figma from '../assets/logo__figma.svg';
import logo__wordpress from '../assets/logo__wordpress.svg';

export default function Projects() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);
  const activeIndexRef = useRef(0);
  const scrollLockedRef = useRef(false);

  const toolIcons = useMemo(() => ({
    html: logo__html,
    css: logo__css,
    js: logo__js,
    react: logo__react,
    photoshop: logo__photoshop,
    figma: logo__figma,
    wordpress: logo__wordpress,
  }), []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const goToProject = (nextIndex) => {
      if (scrollLockedRef.current || nextIndex === activeIndexRef.current) return;

      scrollLockedRef.current = true;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      list.scrollTo({ top: nextIndex * list.clientHeight, behavior: 'smooth' });

      window.setTimeout(() => {
        scrollLockedRef.current = false;
      }, 850);
    };

    const onWheel = (event) => {
      if (window.matchMedia('(max-width: 900px)').matches) return;

      if (Math.abs(event.deltaY) < 10 || scrollLockedRef.current) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndexRef.current + direction;

      if (nextIndex < 0 || nextIndex >= projects.length) return;

      event.preventDefault();
      goToProject(nextIndex);
    };

    const onScrollEnd = () => {
      const nextIndex = Math.round(list.scrollTop / list.clientHeight);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollLockedRef.current = false;
    };

    let touchStartY = 0;
    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event) => {
      if (window.matchMedia('(max-width: 900px)').matches) return;

      const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
      const distance = touchStartY - touchEndY;
      if (Math.abs(distance) < 40) return;

      const direction = distance > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(projects.length - 1, activeIndexRef.current + direction));
      goToProject(nextIndex);
    };

    list.addEventListener('wheel', onWheel, { passive: false });
    list.addEventListener('scrollend', onScrollEnd);
    list.addEventListener('touchstart', onTouchStart, { passive: true });
    list.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      list.removeEventListener('wheel', onWheel);
      list.removeEventListener('scrollend', onScrollEnd);
      list.removeEventListener('touchstart', onTouchStart);
      list.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const close = () => setOpenIndex(null);
  const next = () => setOpenIndex((index) => Math.min(projects.length - 1, index + 1));
  const prev = () => setOpenIndex((index) => Math.max(0, index - 1));

  return (
    <section id="projects" className="projects section-shell" aria-labelledby="projects-title">
      <div className="section-heading" data-reveal="motion" data-reveal-direction="up">
        <p className="eyebrow">Udvalgt arbejde</p>
        <h2 id="projects-title" className="text__title">Projekter</h2>
      </div>

      <div ref={listRef} className="projects__list" aria-label="Projektvisning">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            flip={index % 2 === 1}
            isActive={activeIndex === index}
            onOpen={() => setOpenIndex(index)}
          />
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

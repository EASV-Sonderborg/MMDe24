import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components/navbar.css';
import './components/hero.css';
import './components/projects.css';
import './components/about.css';
import './components/contact.css';

import NavBar from './components/NavBar.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import ScrollReveal from './components/ScrollReveal.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScrollReveal />
    <NavBar />
    <main>
      <Hero />
      <Projects />
      <About />
    </main>
    <Contact />
  </StrictMode>,
);

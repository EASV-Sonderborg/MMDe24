import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/navbar.css'
import './components/hero.css'
import './components/container.css'
import './components/skills.css'
import './components/contact.css'
import './components/projects.css'

import NavBar from './components/NavBar.jsx';
import Hero from './components/Hero.jsx';
import DotGrid from './components/DotGrid.jsx';
import Container from './components/Container.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx'
import Projects from './components/Projects.jsx';


createRoot(document.getElementById('root')).render(

    <StrictMode>
      <DotGrid
  dotSize={6}
  gap={20}
  baseColor="#111625"
  activeColor="#5660ff"
  proximity={200}
  shockRadius={300}
  shockStrength={2}
  resistance={900}
  returnDuration={2}
/>
      <NavBar />
      <div className="animation"></div>
    
      <Hero/> 
      <Container id="about">
        <h2 className='text__subtitle'>About Me</h2>
        <p className='text__body'>Jeg hedder Philip, og jeg studerer Multimediedesign på EASV Sønderborg, hvor jeg på 3. semester har Web Development som specialisering.</p>
        <p className='text__body'>Jeg brænder for at udvikle hjemmesider, der kombinerer godt design med funktionalitet. Jeg motiveres af at finde kreative løsninger, som både ser flotte ud men også fungerer.</p>
        <p className='text__body'>Denne nysgerrighed driver mig til at hele tiden udforske nye ideer og teknologier, så jeg kan udvikle mig både fagligt og kreativt.</p>
      </Container>
      <Skills />
      <Projects />
      <Contact />
    </StrictMode>

)

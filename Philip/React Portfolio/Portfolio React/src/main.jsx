import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NavBar from './NavBar.jsx'
import Card from './Card.jsx'

createRoot(document.getElementById('root')).render(

    <StrictMode>
      <NavBar />
      <Card title="Project 1" description="This is a description of project 1." imageUrl="https://via.placeholder.com/150" />
      
    </StrictMode>

)

import logo__html from '../assets/logo__html.svg';
import logo__css from '../assets/logo__css.svg';
import logo__js from '../assets/logo__js.svg';
import logo__react from '../assets/logo__react.svg';
import logo__photoshop from '../assets/logo__photoshop.svg';
import logo__figma from '../assets/logo__figma.svg';
import logo__wordpress from '../assets/logo__wordpress.svg';

export const skills = [
  {
    category: 'Web Development',
    theme: "blue",
    items: [
      { name: 'HTML', icon: logo__html},
      { name: 'CSS', icon: logo__css},
      { name: 'JavaScript', icon: logo__js},
      { name: 'React', icon: logo__react},
    ],
  },
  {
    category: 'Designværktøjer',
    theme: "green",
    items: [
      { name: 'Adobe Photoshop', icon: logo__photoshop},
      { name: 'Figma', icon: logo__figma},
      { name: 'Wordpress', icon: logo__wordpress},
    ],
  },
];
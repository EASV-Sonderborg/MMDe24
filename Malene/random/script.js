const title = document.querySelector('.header__title');
const animations = ['flip', 'flipInX', 'flipInY'];

const item = Math.floor(Math.random() * animations.length);
//console.log(animations[item]);
//console.log(title);

title.style.animation = `${animations[item]} 3s`;
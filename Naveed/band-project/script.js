window.onscroll = function() {
    const image = document.getElementById('stickyImage');
    
    if (window.scrollY >= 750) {
      image.classList.add('sticky');
    } else {
      image.classList.remove('sticky');
    }
};
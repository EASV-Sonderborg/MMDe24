let lastScrollTop = 0;
let scrollUpDistance = 0; // Tracks how far up the user has scrolled
const header = document.querySelector(".header");
const scrollThreshold = 100; // The distance (in pixels) before the header reappears

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down: hide the header and reset scrollUpDistance
        header.classList.add("hidden");
        scrollUpDistance = 0;
    } else {
        // Scrolling up: increase scrollUpDistance
        scrollUpDistance += lastScrollTop - scrollTop;

        // Show the header only if scrolled up beyond the threshold
        if (scrollUpDistance > scrollThreshold) {
            header.classList.remove("hidden");
        }
    }

    // Update lastScrollTop with current scrollTop for the next scroll event
    lastScrollTop = scrollTop;
});

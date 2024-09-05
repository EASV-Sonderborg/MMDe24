window.onscroll = function() {
    var Box = document.getElementById("Box");
    var originalHeight = 80; // Original height of .Box
    var shrinkHeight = 50; // Height when scrolled

    if (window.pageYOffset > 0) {
        Box.style.height = shrinkHeight + "px"; // Shrink height when scrolled
    } else {
        Box.style.height = originalHeight + "px"; // Reset height when at the top
    }
};

document.addEventListener("DOMContentLoaded", () =>    {
    const boxes = document.querySelectorAll(".box");
    
        let randomIndex = Math.floor(Math.random() * boxes.length);

        boxes[randomIndex].classList.add("highlight");

        sessionStorage.setItem("highlightedBox", boxes[randomIndex].id);
    
});








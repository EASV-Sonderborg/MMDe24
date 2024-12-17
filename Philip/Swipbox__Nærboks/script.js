document.addEventListener("DOMContentLoaded", () =>    {
    const boxes = document.querySelectorAll(".box");
    
   if (document.querySelector("connected__title"))  { 
        let randomIndex = Math.floor(Math.random() * boxes.length);

        boxes[randomIndex].classList.add("highlight");

        sessionStorage.setItem("highlightedBox", boxes[randomIndex].id);
}

    const highlightedBoxId = sessionStorage.getItem("highlightedBox");

    if  (highlightedBoxId)  {
        const box = document.getElementById(highlightedBoxId);

        if (box) {
            box.classList.add("open");
        }
    }    
});
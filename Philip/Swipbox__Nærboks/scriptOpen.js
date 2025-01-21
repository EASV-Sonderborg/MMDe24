
document.addEventListener("DOMContentLoaded", () =>    {
    const highlightedBoxId = sessionStorage.getItem("highlightedBox");

    if  (highlightedBoxId)  {
        const box = document.getElementById(highlightedBoxId);

        if (box) {
            box.classList.add("open");

            const reOpenButton = document.getElementById("reOpen");

            reOpenButton.addEventListener("click", (e) => {
                e.preventDefault();

                box.classList.remove("open");
                void box.offsetWidth;
                box.classList.add("open");
            });
        }
    }
});





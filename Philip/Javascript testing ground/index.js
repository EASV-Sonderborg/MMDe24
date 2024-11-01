
const obstacles = document.querySelectorAll('.obstacle');

function checkCollision() {
    const pongRect = pong.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            pongRect.x < obstacleRect.x + obstacleRect.width &&
            pongRect.x + pongRect.width > obstacleRect.x &&
            pongRect.y < obstacleRect.y + obstacleRect.height &&
            pongRect.y + pongRect.height > obstacleRect.y
        ) {
            console.log("Collision detected!");
            // Here you can handle the collision (e.g., reset position, change color, etc.)
        }
    });
}




const resetButton = document.getElementById("resetButton");

const   pong = document.getElementById("pong");
const moveY = 20;
const moveX = 50;
let x = 0;
let y = 0;


document.addEventListener("keydown", event =>   {
    pong.style.height = "300px";
    pong.style.width = "300px";
})
document.addEventListener("keyup", event =>   {
    pong.style.height = "200px";
    pong.style.width = "200px";
})




document.addEventListener("keydown", event =>   {

    if(event.key.startsWith("Arrow")){

        event.preventDefault();

        switch(event.key){
            case "ArrowUp":
                y -= moveY;
                pong.style.backgroundColor = "green"
                break;
            case "ArrowDown":
                y += moveY;
                pong.style.backgroundColor = "blue"
                break;
            case "ArrowLeft":
                x -= moveX;
                pong.style.backgroundColor = "yellow"
                break;
            case "ArrowRight":
                x += moveX;
                pong.style.backgroundColor = "crimson"
                break;
        }

        pong.style.top = `${y}px`;
        pong.style.left = `${x}px`;
    } 
});

resetButton.addEventListener("click", () => {
    x = 0;
    y = 0;
    pong.style.top = `${y}px`;
    pong.style.left = `${x}px`;
})
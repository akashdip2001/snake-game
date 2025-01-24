// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

let food = {x: 6, y: 7};

// Function to show Game Over Message
function showGameOverMessage() {
    const overlay = document.createElement('div');
    overlay.id = 'gameOverOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const message = document.createElement('div');
    message.style.color = 'white';
    message.style.fontSize = '2rem';
    message.style.marginBottom = '20px';
    message.innerText = 'Game Over!';

    const scoreMessage = document.createElement('div');
    scoreMessage.style.color = 'white';
    scoreMessage.style.fontSize = '1.5rem';
    scoreMessage.innerText = `Your Score: ${score} | High Score: ${hiscoreval}`;

    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.style.margin = '10px';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '1rem';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = () => {
        location.reload(); // Reload the page to restart the game
    };

    overlay.appendChild(message);
    overlay.appendChild(scoreMessage);
    overlay.appendChild(restartButton);
    document.body.appendChild(overlay);
}

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        if (!gameOverSound.played.length) { // Ensure the sound plays only once
            gameOverSound.play();
        }
        musicSound.pause();
        inputDir = {x: 0, y: 0}; 
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
        }
        showGameOverMessage();
        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = `<b>Score:</b> ${score}`;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())};
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) { 
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
}

scoreBox.innerHTML = `<b>Score:</b> ${score}`;
hiscoreBox.innerHTML = ""; // Hide HiScore initially
window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1}; // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});


// // Confirm before closing the window
// window.addEventListener('beforeunload', (event) => {
//     event.preventDefault();
//     event.returnValue = ''; // This will show a confirmation dialog
// });



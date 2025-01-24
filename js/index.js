const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

let score = 0;
let snake = [{ x: 10, y: 10 }]; // Initial snake position
let direction = { x: 1, y: 0 }; // Initial direction
let food = { x: getRandomPosition(), y: getRandomPosition() }; // Initial food position
let gameInterval;
let gameOverSoundPlayed = false;

// Load the game-over sound
const gameOverSound = new Audio("game-over-sound.mp3");

// Function to start/restart the game
function startGame() {
  // Reset all game variables
  score = 0;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = { x: getRandomPosition(), y: getRandomPosition() };
  gameOverSoundPlayed = false;

  // Reset the UI
  document.getElementById("score").innerText = `Score: ${score}`;
  clearInterval(gameInterval); // Stop any previous game loop
  gameInterval = setInterval(updateGame, 100); // Start a new game loop
}

// Function to update the game (game loop)
function updateGame() {
  // Update snake position
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
    food = { x: getRandomPosition(), y: getRandomPosition() };
  } else {
    snake.pop(); // Remove last part of the snake if no food eaten
  }

  // Check collision with walls or itself
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || isCollision(head)) {
    clearInterval(gameInterval); // Stop the game loop
    playGameOverSound(); // Play game-over sound
    alert("Game Over! Your Score: " + score);
    return;
  }

  snake.unshift(head); // Add new head to the snake

  // Draw everything
  drawGame();
}

// Function to draw the game (snake and food)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Draw snake
  ctx.fillStyle = "green";
  snake.forEach(part => ctx.fillRect(part.x * 20, part.y * 20, 20, 20));

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

// Function to play the game-over sound only once
function playGameOverSound() {
  if (!gameOverSoundPlayed) {
    gameOverSound.play();
    gameOverSoundPlayed = true; // Prevent sound from playing again
  }
}

// Utility: Generate random positions for food
function getRandomPosition() {
  return Math.floor(Math.random() * 20); // Assuming a 20x20 grid
}

// Utility: Check collision of snake with itself
function isCollision(head) {
  return snake.some(part => part.x === head.x && part.y === head.y);
}

// Event listener for keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

// Event listener for restart button
restartButton.addEventListener("click", startGame);

// Start the game for the first time
startGame();

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

let box = 32;
let horizontalBoxCount = 17;
let verticalBoxCount = 15;

let score = 0;

let food = generateFood();
let maxTickCount = 10;
let tickCount= 0;
let animationFrame;

function generateFood() {
    return {
        x: Math.floor(Math.random() * horizontalBoxCount + 1) * box,
        y: Math.floor(Math.random() * verticalBoxCount + 3) * box
    };
}

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

document.addEventListener('keydown', direction);

let dir;

function direction(event) {
    if(event.keyCode == 37 && dir != "right") {
        dir = "left";
    } else if (event.keyCode == 38 && dir != "down") {
        dir = "up";
    } else if (event.keyCode == 39 && dir != "left") {
        dir = "right";
    } else if (event.keyCode == 40 && dir != "up") {
        dir = "down";
    }
}

function eatTail(head, arr) {
    let eaten;
    arr.forEach((item) => {
        if (head.x == item.x && head.y == item.y) {
            eaten = true;
        }
    });
    return eaten
}

function gameOver() {
    cancelAnimationFrame(animationFrame);
    alert('GAME OVER');
}

function winGame() {
    cancelAnimationFrame(animationFrame);
    alert('WIN OVER');
}

function drawGame() {
    let lose;
    let win;
    if (tickCount == maxTickCount) {
        ctx.drawImage(ground, 0, 0);
        ctx.drawImage(foodImg, food.x, food.y);
        snake.forEach((snakeItem, i) => {
            ctx.fillStyle = i == 0 ? 'green' : 'red';
            ctx.fillRect(snakeItem.x, snakeItem.y, box, box)
        });

        ctx.fillStyle = 'white';
        ctx.font = "50px Arial";
        ctx.fillText(score, box * 2.5, box * 1.7);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = generateFood();
        } else {
            snake.pop();
        }

        if (snakeX < box || snakeX > box * horizontalBoxCount
            || snakeY < 3 * box || snakeY > box * (2 + verticalBoxCount)) {
            lose = true;
        }

        if (dir == "left") snakeX -= box;
        if (dir == "right") snakeX += box;
        if (dir == "up") snakeY -= box;
        if (dir == "down") snakeY += box;

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if(eatTail(newHead, snake)) {
            lose = true;
        }

        snake.unshift(newHead);
        if (snake.length === verticalBoxCount * horizontalBoxCount) {
            winGame();
            return;
        }
        tickCount=0
    } else {
        tickCount++;
    }
    if (lose) {
        gameOver();
        return;
    }
    animationFrame = requestAnimationFrame(drawGame);
}

// let game = setInterval(drawGame, 100);
drawGame();

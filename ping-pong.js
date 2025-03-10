(function () {
    let canvas, ctx, playerPaddle, computerPaddle, ball, playerScore;
    let canvasWidth, canvasHeight;
    const paddleWidth = 10;
    const paddleHeight = 60;
    const ballRadius = 10;
    const paddleSpeed = 7;
    const ballSpeedX = 5;
    const ballSpeedY = 5;

    function init() {
        // Create canvas to fill the entire page
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '10000';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

        // Get canvas dimensions
        canvasWidth = canvas.offsetWidth;
        canvasHeight = canvas.offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Initialize paddles and ball
        playerPaddle = {
            x: 10,
            y: canvasHeight / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
        };

        computerPaddle = {
            x: canvasWidth - paddleWidth - 10,
            y: canvasHeight / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
        };

        ball = {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            radius: ballRadius,
            speedX: ballSpeedX,
            speedY: ballSpeedY,
        };

        playerScore = 0;

        // Mouse control
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            playerPaddle.y = mouseY - paddleHeight / 2;
        });

        // Start game loop
        gameLoop();
    }

    function gameLoop() {
        // Initialization check
        if (!ball || !playerPaddle || !computerPaddle) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Move the ball
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // Bounce off top and bottom boundaries
        if (ball.y < ballRadius || ball.y > canvasHeight - ballRadius) {
            ball.speedY = -ball.speedY;
        }

        // Improved paddle collision check
        if (checkPaddleCollision(ball, playerPaddle)) {
            ball.speedX = Math.abs(ball.speedX); // Bounce right
            playerScore++;
        }

        if (checkPaddleCollision(ball, computerPaddle)) {
            ball.speedX = -Math.abs(ball.speedX); // Bounce left
        }

        // Computer paddle movement
        const computerPaddleCenter = computerPaddle.y + paddleHeight / 2;
        if (computerPaddleCenter < ball.y - 35) {
            computerPaddle.y += paddleSpeed;
        } else if (computerPaddleCenter > ball.y + 35) {
            computerPaddle.y -= paddleSpeed;
        }

        // Check if the ball is out of bounds
        if (ball.x < 0 || ball.x > canvasWidth) {
            gameOver();
            return;
        }

        // Draw paddles and ball
        ctx.fillStyle = '#fff';
        ctx.fillRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
        ctx.fillRect(computerPaddle.x, computerPaddle.y, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw score (islands) with rounded corners
        const islandWidth = 100;
        const islandHeight = 20;
        const cornerRadius = 10; // Rounding radius
        ctx.fillStyle = '#333';
        roundRect(
            ctx,
            canvasWidth / 2 - islandWidth / 2,
            10,
            islandWidth,
            islandHeight,
            cornerRadius,
        );
        ctx.fillStyle = '#fff';
        ctx.fillText(
            `${playerScore}`,
            canvasWidth / 2,
            25,
            islandWidth,
            islandHeight,
        );
        ctx.textAlign = 'center';

        // Request next animation frame
        requestAnimationFrame(gameLoop);
    }

    function checkPaddleCollision(ball, paddle) {
        if (!ball || !paddle) return false; // Add check for undefined
        const ballLeft = ball.x - ball.radius;
        const ballRight = ball.x + ball.radius;
        const ballTop = ball.y - ball.radius;
        const ballBottom = ball.y + ball.radius;

        const paddleLeft = paddle.x;
        const paddleRight = paddle.x + paddle.width;
        const paddleTop = paddle.y;
        const paddleBottom = paddle.y + paddle.height;

        if (
            ballRight > paddleLeft &&
            ballLeft < paddleRight &&
            ballBottom > paddleTop &&
            ballTop < paddleBottom
        ) {
            // Collision occurred
            // Correct ball position to prevent it from passing through the paddle
            if (ball.speedX < 0) {
                ball.x = paddleRight + ball.radius; // Correction for left paddle
            } else {
                ball.x = paddleLeft - ball.radius; // Correction for right paddle
            }
            return true;
        }
        return false;
    }

    // Function to draw a rectangle with rounded corners
    function roundRect(ctx, x, y, width, height, radius) {
        radius = Math.min(width / 2, height / 2, radius);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        ctx.fill();
    }
    init();
})(); // Game loop stop

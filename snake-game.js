(function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 20; // Размер клетки
    const speed = 200; // Скорость змейки (меньше = быстрее)

    // Настройки холста для полноэкранного отображения
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';

    // Обработчик изменения размера окна для динамического обновления размеров холста
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    });

    document.body.appendChild(canvas);

    let snake = [{ x: 5, y: 5 }];
    let food = { x: 10, y: 10 };
    let direction = 'right';
    let gameInterval;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем границу
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Рисуем змейку
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? 'lime' : '#32CD32';
            ctx.strokeStyle = '#006400';
            ctx.lineWidth = 2;

            ctx.fillRect(segment.x * size, segment.y * size, size, size);
            ctx.strokeRect(segment.x * size, segment.y * size, size, size);
        });

        // Рисуем яблоко
        ctx.beginPath();
        ctx.arc((food.x * size) + size / 2, (food.y * size) + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function move() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (
            head.x < 0 || 
            head.y < 0 || 
            head.x * size >= canvas.width || 
            head.y * size >= canvas.height
        ) {
            endGame();
            return;
        }

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            placeFood();
        } else {
            snake.pop();
        }
    }

    function placeFood() {
        const maxX = Math.floor(canvas.width / size);
        const maxY = Math.floor(canvas.height / size);

        food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };

        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            placeFood();
        }
    }

    function changeDirection(event) {
        switch (event.code) {
            case 'KeyW': if (direction !== 'down') direction = 'up'; break;
            case 'KeyS': if (direction !== 'up') direction = 'down'; break;
            case 'KeyA': if (direction !== 'right') direction = 'left'; break;
            case 'KeyD': if (direction !== 'left') direction = 'right'; break;
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        alert('Игра окончена! Ваш счет: ' + (snake.length - 1));
        document.body.removeChild(canvas);
    }

    function startGame() {
        document.addEventListener('keydown', changeDirection);
        placeFood();
        gameInterval = setInterval(() => {
            move();
            draw();
        }, speed);
    }

    startGame();
})();

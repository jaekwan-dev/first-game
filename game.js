const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

console.log('게임이 시작되었습니다!');
console.log('캔버스 크기:', canvas.width, 'x', canvas.height);

// 게임 객체
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 3,
    dy: -3
};

const paddle = {
    width: 80,
    height: 15,
    x: canvas.width / 2 - 40,
    y: canvas.height - 40
};

console.log('패들 초기 위치:', paddle.x, paddle.y);

let rightPressed = false;
let leftPressed = false;
let touchX = 0;

// 이벤트 리스너
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener('touchmove', touchMoveHandler, { passive: false });
document.addEventListener('touchstart', touchStartHandler, { passive: false });

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    // 패들이 화면 밖으로 벗어나지 않도록 제한
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX - paddle.width / 2));
}

function touchStartHandler(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchX = touch.clientX;
}

function touchMoveHandler(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const relativeX = touch.clientX - canvas.offsetLeft;
    // 패들이 화면 밖으로 벗어나지 않도록 제한
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX - paddle.width / 2));
}

// 충돌 감지
function collisionDetection() {
    // 좌우 벽 충돌
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    
    // 상단 벽 충돌
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } 
    // 패들과의 충돌
    else if (ball.y + ball.dy > paddle.y - ball.radius && 
             ball.y + ball.dy < paddle.y + paddle.height &&
             ball.x > paddle.x && 
             ball.x < paddle.x + paddle.width) {
        // 패들의 상단에만 충돌 처리
        if (ball.y + ball.dy <= paddle.y + ball.radius) {
            ball.dy = -ball.dy;
        }
    }
    // 하단 벽 충돌 (게임 오버)
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        document.location.reload();
    }
}

// 그리기 함수
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6B6B';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#4ECDC4';
    ctx.fill();
    ctx.closePath();
}

// 게임 루프
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBall();
    drawPaddle();
    
    collisionDetection();
    
    // 패들 이동 (키보드 컨트롤)
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x = Math.min(canvas.width - paddle.width, paddle.x + 5);
    } else if (leftPressed && paddle.x > 0) {
        paddle.x = Math.max(0, paddle.x - 5);
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    requestAnimationFrame(draw);
}

draw(); 
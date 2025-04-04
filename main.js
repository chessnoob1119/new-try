const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1240;
canvas.height = 720;

// 게임 시작 화면 배경 (start_background.png)
const startBackground = new Image();
startBackground.src = "res/img/start_background.png";

// 플레이어 스프라이트 설정
const playerSpriteSheet = new Image();
playerSpriteSheet.src = "res/img/player.png"; // 플레이어 스프라이트 경로

// 플레이어 객체 (기본 스탯 포함)
const player = {
    x: 100,
    y: canvas.height - 150,
    width: 24,
    height: 32,
    speed: 5,
    dx: 0,
    dy: 0,
    onGround: false,
    currentFrame: 0,
    totalFrames: 5,
    animationSpeed: 8,
    frameCounter: 0,
    facingRight: true,
    moving: false,
    hp: 100,
    attack: 10,
    defense: 5
};

const groundHeight = 50;
const groundY = canvas.height - groundHeight;

const keys = { w: false, a: false, d: false };

let gameStarted = false; // 게임 시작 상태
let blink = true;        // 깜빡임 상태
let lastBlinkTime = Date.now();
const blinkInterval = 500; // 500ms 간격

// 능력치 인터페이스 업데이트 함수 (세로 정렬, 각 항목마다 줄바꿈)
function updateStats() {
    const statsDiv = document.getElementById("stats");
    if (statsDiv) {
        statsDiv.innerHTML = `HP: ${player.hp}<br>ATK: ${player.attack}<br>DEF: ${player.defense}`;
        statsDiv.style.display= "block";
    }
}

// 게임 시작 화면 텍스트 그리기 함수 (start_background 사용)
function drawStartScreen() {
    ctx.drawImage(startBackground, 0, 0, canvas.width, canvas.height);
    
    const currentTime = Date.now();
    if (currentTime - lastBlinkTime > blinkInterval) {
        blink = !blink;
        lastBlinkTime = currentTime;
    }
    if (blink) {
        ctx.fillStyle = "white";
        ctx.font = "40px 'Press Start 2P', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Press Enter To START", canvas.width / 2, canvas.height - 50);
    }
}

// 게임 루프 함수
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!gameStarted) {
        drawStartScreen();
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // 게임 플레이 배경: 하늘과 땅 그리기
    ctx.fillStyle = "#87CEEB"; // 하늘색
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#228B22"; // 땅 색상
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
    
    // 플레이어 그리기 (애니메이션)
    const frameWidth = player.width;
    const frameHeight = player.height;
    const spriteX = player.currentFrame * frameWidth;
    const spriteY = 0;
    
    ctx.save();
    if (!player.facingRight) {
        ctx.scale(-1, 1);
        ctx.drawImage(playerSpriteSheet, spriteX, spriteY, frameWidth, frameHeight, 
                      -player.x - player.width, player.y, player.width, player.height);
    } else {
        ctx.drawImage(playerSpriteSheet, spriteX, spriteY, frameWidth, frameHeight, 
                      player.x, player.y, player.width, player.height);
    }
    ctx.restore();
    
    movePlayer();
    updateStats();
    requestAnimationFrame(gameLoop);
}

// 키 이벤트 처리
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !gameStarted) {
        gameStarted = true;
    }
    if (e.key === "a") {
        keys.a = true;
        player.moving = true;
        player.facingRight = false;
    }
    if (e.key === "d") {
        keys.d = true;
        player.moving = true;
        player.facingRight = true;
    }
    if (e.key === "w" && player.onGround) {
        keys.w = true;
        player.dy = -10;
        player.onGround = false;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "a") keys.a = false;
    if (e.key === "d") keys.d = false;
    if (!keys.a && !keys.d) {
        player.moving = false;
        player.currentFrame = 0; // 정지 시 첫 번째 프레임
    }
});

function movePlayer() {
    if (keys.a) player.dx = -player.speed;
    else if (keys.d) player.dx = player.speed;
    else player.dx = 0;
    
    if (!player.onGround) player.dy += 0.5;
    
    player.x += player.dx;
    player.y += player.dy;
    
    if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.dy = 0;
        player.onGround = true;
    }
    
    if (player.moving) {
        player.frameCounter++;
        if (player.frameCounter >= player.animationSpeed) {
            player.frameCounter = 0;
            player.currentFrame++;
            if (player.currentFrame > 4) player.currentFrame = 1;
        }
    }
}

playerSpriteSheet.onload = function () {
    gameLoop();
};

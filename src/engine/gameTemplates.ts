export interface GameConfig {
  genre: string;
  title: string;
  playerColor: string;
  backgroundColor: string;
  enemyColor: string;
  accentColor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  playerType: string;
  enemyType: string;
  environment: string;
  speed: number;
  size: number;
}

export interface GameTemplate {
  id: string;
  name: string;
  genre: string;
  keywords: string[];
  generateCode: (config: GameConfig) => string;
}

export const defaultConfig: GameConfig = {
  genre: 'platformer',
  title: 'My Game',
  playerColor: '#00ff00',
  backgroundColor: '#1a1a2e',
  enemyColor: '#ff0000',
  accentColor: '#ffd700',
  difficulty: 'medium',
  playerType: 'hero',
  enemyType: 'enemy',
  environment: 'default',
  speed: 5,
  size: 30,
};

function wrapGame(title: string, backgroundColor: string, gameScript: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: ${backgroundColor}; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; font-family: Arial, sans-serif; }
canvas { border: 2px solid #333; display: block; }
#score { position: absolute; top: 10px; left: 10px; color: #fff; font-size: 18px; font-family: monospace; }
#message { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-size: 24px; font-family: monospace; text-align: center; display: none; }
</style>
</head>
<body>
<div id="score">Score: 0</div>
<div id="message"></div>
<canvas id="gameCanvas"></canvas>
<script>
${gameScript}
</script>
</body>
</html>`;
}

const platformerTemplate: GameTemplate = {
  id: 'platformer',
  name: 'Platformer',
  genre: 'platformer',
  keywords: ['platform', 'jump', 'side-scroll', 'mario', 'run', 'collect'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const gravity = 0.6;
const jumpForce = -12;
const speed = ${config.speed};

const player = { x: 100, y: 300, w: ${config.size}, h: ${config.size}, vy: 0, onGround: false };
const keys = {};
const platforms = [];
const coins = [];
let cameraX = 0;

function generateLevel() {
  for (let i = 0; i < 50; i++) {
    platforms.push({ x: i * 200 + Math.random() * 100, y: 350 + Math.random() * 100, w: 100 + Math.random() * 80, h: 15 });
    if (Math.random() > 0.4) {
      coins.push({ x: i * 200 + 50 + Math.random() * 100, y: 250 + Math.random() * 80, w: 15, h: 15, collected: false });
    }
  }
  platforms.unshift({ x: -50, y: 450, w: 300, h: 20 });
}
generateLevel();

document.addEventListener('keydown', (e) => { keys[e.key] = true; if (e.key === 'r' || e.key === 'R') restart(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function restart() {
  gameOver = false; score = 0; player.x = 100; player.y = 300; player.vy = 0;
  cameraX = 0; platforms.length = 0; coins.length = 0; generateLevel();
  msgEl.style.display = 'none';
}

function update() {
  if (gameOver) return;
  if (keys['ArrowLeft'] || keys['a']) player.x -= speed;
  if (keys['ArrowRight'] || keys['d']) player.x += speed;
  if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.onGround) { player.vy = jumpForce; player.onGround = false; }

  player.vy += gravity;
  player.y += player.vy;
  player.onGround = false;

  for (const p of platforms) {
    if (player.x + player.w > p.x && player.x < p.x + p.w && player.y + player.h >= p.y && player.y + player.h <= p.y + 20 && player.vy >= 0) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }

  for (const c of coins) {
    if (!c.collected && player.x + player.w > c.x && player.x < c.x + c.w && player.y + player.h > c.y && player.y < c.y + c.h) {
      c.collected = true; score += 10;
    }
  }

  if (player.y > 600) { gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block'; }
  cameraX = player.x - 200;
  scoreEl.textContent = 'Score: ' + score;
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cameraX, 0);

  ctx.fillStyle = '#555';
  for (const p of platforms) { ctx.fillRect(p.x, p.y, p.w, p.h); }

  ctx.fillStyle = '${config.accentColor}';
  for (const c of coins) { if (!c.collected) ctx.fillRect(c.x, c.y, c.w, c.h); }

  ctx.fillStyle = '${config.playerColor}';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.restore();
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'Platformer', config.backgroundColor, script);
  },
};

const spaceShooterTemplate: GameTemplate = {
  id: 'space-shooter',
  name: 'Space Shooter',
  genre: 'shooter',
  keywords: ['space', 'shoot', 'shooter', 'bullet', 'alien', 'spaceship', 'laser', 'galaga', 'invader'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 700;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const speed = ${config.speed};
const playerSize = ${config.size};

const player = { x: 270, y: 620, w: playerSize, h: playerSize };
const bullets = [];
const enemies = [];
const enemyBullets = [];
const keys = {};
let spawnTimer = 0;
const spawnRate = ${config.difficulty === 'easy' ? 90 : config.difficulty === 'hard' ? 30 : 55};

document.addEventListener('keydown', (e) => { keys[e.key] = true; if (e.key === 'r' || e.key === 'R') restart(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function restart() {
  gameOver = false; score = 0; player.x = 270; bullets.length = 0; enemies.length = 0; enemyBullets.length = 0;
  msgEl.style.display = 'none';
}

function update() {
  if (gameOver) return;
  if (keys['ArrowLeft'] || keys['a']) player.x -= speed;
  if (keys['ArrowRight'] || keys['d']) player.x += speed;
  if (keys[' ']) { if (bullets.length < 5 || bullets[bullets.length-1].y < player.y - 50) bullets.push({ x: player.x + player.w/2 - 3, y: player.y, w: 6, h: 12 }); }
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  for (let i = bullets.length - 1; i >= 0; i--) { bullets[i].y -= 8; if (bullets[i].y < -10) bullets.splice(i, 1); }

  spawnTimer++;
  if (spawnTimer >= spawnRate) {
    spawnTimer = 0;
    enemies.push({ x: Math.random() * (canvas.width - 30), y: -30, w: 30, h: 30, vy: 1.5 + Math.random() * 2 });
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].vy;
    if (Math.random() < 0.005) enemyBullets.push({ x: enemies[i].x + 12, y: enemies[i].y + 30, w: 5, h: 10 });
    if (enemies[i].y > canvas.height) { enemies.splice(i, 1); continue; }
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j].x < enemies[i].x + enemies[i].w && bullets[j].x + bullets[j].w > enemies[i].x && bullets[j].y < enemies[i].y + enemies[i].h && bullets[j].y + bullets[j].h > enemies[i].y) {
        enemies.splice(i, 1); bullets.splice(j, 1); score += 10; break;
      }
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].y += 4;
    if (enemyBullets[i].y > canvas.height) { enemyBullets.splice(i, 1); continue; }
    if (enemyBullets[i].x < player.x + player.w && enemyBullets[i].x + enemyBullets[i].w > player.x && enemyBullets[i].y < player.y + player.h && enemyBullets[i].y + enemyBullets[i].h > player.y) {
      gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
    }
  }

  for (const e of enemies) {
    if (e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) {
      gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
    }
  }
  scoreEl.textContent = 'Score: ' + score;
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '${config.playerColor}';
  ctx.beginPath(); ctx.moveTo(player.x + player.w/2, player.y); ctx.lineTo(player.x, player.y + player.h); ctx.lineTo(player.x + player.w, player.y + player.h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffff00';
  for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = '${config.enemyColor}';
  for (const e of enemies) ctx.fillRect(e.x, e.y, e.w, e.h);
  ctx.fillStyle = '#ff6600';
  for (const eb of enemyBullets) ctx.fillRect(eb.x, eb.y, eb.w, eb.h);
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'Space Shooter', config.backgroundColor, script);
  },
};

const snakeTemplate: GameTemplate = {
  id: 'snake',
  name: 'Snake',
  genre: 'snake',
  keywords: ['snake', 'grow', 'eat', 'classic', 'retro', 'nokia'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let gameOver = false;
let score = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 1, dy = 0;
let lastTime = 0;
const gameSpeed = ${config.difficulty === 'easy' ? 150 : config.difficulty === 'hard' ? 70 : 100};

document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') restart();
  if (e.key === 'ArrowUp' || e.key === 'w') { if (dy !== 1) { dx = 0; dy = -1; } }
  if (e.key === 'ArrowDown' || e.key === 's') { if (dy !== -1) { dx = 0; dy = 1; } }
  if (e.key === 'ArrowLeft' || e.key === 'a') { if (dx !== 1) { dx = -1; dy = 0; } }
  if (e.key === 'ArrowRight' || e.key === 'd') { if (dx !== -1) { dx = 1; dy = 0; } }
});

function restart() {
  gameOver = false; score = 0; snake = [{ x: 10, y: 10 }]; dx = 1; dy = 0;
  placeFood(); msgEl.style.display = 'none';
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function update(timestamp) {
  if (gameOver) { requestAnimationFrame(update); return; }
  if (timestamp - lastTime < gameSpeed) { requestAnimationFrame(update); return; }
  lastTime = timestamp;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block'; requestAnimationFrame(update); return;
  }
  for (const seg of snake) {
    if (seg.x === head.x && seg.y === head.y) {
      gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block'; requestAnimationFrame(update); return;
    }
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) { score += 10; placeFood(); } else { snake.pop(); }
  scoreEl.textContent = 'Score: ' + score;

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '${config.playerColor}';
  for (const seg of snake) { ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2); }
  ctx.fillStyle = '${config.accentColor}';
  ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);
}

requestAnimationFrame(update);
`;
    return wrapGame(config.title || 'Snake', config.backgroundColor, script);
  },
};

const flappyBirdTemplate: GameTemplate = {
  id: 'flappy-bird',
  name: 'Flappy Bird',
  genre: 'flappy',
  keywords: ['flappy', 'bird', 'fly', 'pipe', 'tap', 'wing'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const birdSize = ${config.size * 0.6};
const bird = { x: 80, y: 300, vy: 0, w: birdSize, h: birdSize };
const gravity = 0.5;
const flapForce = -8;
const pipeSpeed = ${config.speed * 0.6};
const pipeGap = ${config.difficulty === 'easy' ? 180 : config.difficulty === 'hard' ? 120 : 150};
const pipes = [];
let pipeTimer = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') restart();
  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') { if (!gameOver) bird.vy = flapForce; }
});
canvas.addEventListener('click', () => { if (!gameOver) bird.vy = flapForce; else restart(); });

function restart() {
  gameOver = false; score = 0; bird.y = 300; bird.vy = 0; pipes.length = 0; pipeTimer = 0;
  msgEl.style.display = 'none';
}

function update() {
  if (gameOver) return;
  bird.vy += gravity;
  bird.y += bird.vy;

  pipeTimer++;
  if (pipeTimer > 90) {
    pipeTimer = 0;
    const gapY = 100 + Math.random() * (canvas.height - 250);
    pipes.push({ x: canvas.width, gapY: gapY, w: 50, scored: false });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= pipeSpeed;
    if (pipes[i].x + pipes[i].w < 0) { pipes.splice(i, 1); continue; }
    if (!pipes[i].scored && pipes[i].x + pipes[i].w < bird.x) { pipes[i].scored = true; score++; }
    if (bird.x + bird.w > pipes[i].x && bird.x < pipes[i].x + pipes[i].w) {
      if (bird.y < pipes[i].gapY || bird.y + bird.h > pipes[i].gapY + pipeGap) {
        gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
      }
    }
  }

  if (bird.y + bird.h > canvas.height || bird.y < 0) {
    gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
  }
  scoreEl.textContent = 'Score: ' + score;
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '${config.playerColor}';
  ctx.beginPath(); ctx.arc(bird.x + bird.w/2, bird.y + bird.h/2, bird.w/2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '${config.enemyColor}';
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, p.w, p.gapY);
    ctx.fillRect(p.x, p.gapY + pipeGap, p.w, canvas.height - p.gapY - pipeGap);
  }
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'Flappy Bird', config.backgroundColor, script);
  },
};

const breakoutTemplate: GameTemplate = {
  id: 'breakout',
  name: 'Breakout',
  genre: 'breakout',
  keywords: ['breakout', 'pong', 'brick', 'paddle', 'ball', 'bounce', 'arkanoid', 'block'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 500;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const paddleW = 100, paddleH = 12;
const paddle = { x: 250, y: canvas.height - 30 };
const ball = { x: 300, y: 400, vx: ${config.speed * 0.8}, vy: -${config.speed * 0.8}, r: 8 };
const bricks = [];
const brickRows = ${config.difficulty === 'easy' ? 4 : config.difficulty === 'hard' ? 7 : 5};
const brickCols = 8;
const brickW = 65, brickH = 20, brickPad = 5;
const keys = {};

for (let r = 0; r < brickRows; r++) {
  for (let c = 0; c < brickCols; c++) {
    bricks.push({ x: c * (brickW + brickPad) + 35, y: r * (brickH + brickPad) + 40, alive: true });
  }
}

document.addEventListener('keydown', (e) => { keys[e.key] = true; if (e.key === 'r' || e.key === 'R') restart(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function restart() {
  gameOver = false; score = 0; ball.x = 300; ball.y = 400; ball.vx = ${config.speed * 0.8}; ball.vy = -${config.speed * 0.8}; paddle.x = 250;
  for (const b of bricks) b.alive = true;
  msgEl.style.display = 'none';
}

function update() {
  if (gameOver) return;
  if (keys['ArrowLeft'] || keys['a']) paddle.x -= 7;
  if (keys['ArrowRight'] || keys['d']) paddle.x += 7;
  paddle.x = Math.max(0, Math.min(canvas.width - paddleW, paddle.x));

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
  if (ball.y - ball.r < 0) ball.vy *= -1;

  if (ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddleW) {
    ball.vy = -Math.abs(ball.vy);
    ball.vx = ((ball.x - (paddle.x + paddleW/2)) / (paddleW/2)) * ${config.speed};
  }

  if (ball.y > canvas.height + 20) {
    gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
  }

  for (const b of bricks) {
    if (!b.alive) continue;
    if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + brickW && ball.y + ball.r > b.y && ball.y - ball.r < b.y + brickH) {
      b.alive = false; ball.vy *= -1; score += 10;
    }
  }

  if (bricks.every(b => !b.alive)) {
    gameOver = true; msgEl.innerHTML = 'You Win!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
  }
  scoreEl.textContent = 'Score: ' + score;
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '${config.playerColor}';
  ctx.fillRect(paddle.x, paddle.y, paddleW, paddleH);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
  const colors = ['${config.enemyColor}', '${config.accentColor}', '#ff6600', '#00ccff', '#cc00ff'];
  for (let i = 0; i < bricks.length; i++) {
    if (!bricks[i].alive) continue;
    ctx.fillStyle = colors[Math.floor(i / brickCols) % colors.length];
    ctx.fillRect(bricks[i].x, bricks[i].y, brickW, brickH);
  }
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'Breakout', config.backgroundColor, script);
  },
};

const racingTemplate: GameTemplate = {
  id: 'racing',
  name: 'Racing',
  genre: 'racing',
  keywords: ['race', 'racing', 'car', 'drive', 'road', 'speed', 'dodge', 'traffic'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const speed = ${config.speed};
const playerW = ${config.size}, playerH = ${config.size * 1.5};
const player = { x: 230, y: 580 };
const obstacles = [];
const keys = {};
let spawnTimer = 0;
let roadOffset = 0;
const laneWidth = 100;

document.addEventListener('keydown', (e) => { keys[e.key] = true; if (e.key === 'r' || e.key === 'R') restart(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function restart() {
  gameOver = false; score = 0; player.x = 230; obstacles.length = 0; spawnTimer = 0;
  msgEl.style.display = 'none';
}

function update() {
  if (gameOver) return;
  if (keys['ArrowLeft'] || keys['a']) player.x -= speed + 2;
  if (keys['ArrowRight'] || keys['d']) player.x += speed + 2;
  player.x = Math.max(50, Math.min(canvas.width - 50 - playerW, player.x));

  roadOffset += speed;
  spawnTimer++;
  const spawnRate = ${config.difficulty === 'easy' ? 50 : config.difficulty === 'hard' ? 25 : 35};
  if (spawnTimer > spawnRate) {
    spawnTimer = 0;
    const laneX = 70 + Math.floor(Math.random() * 4) * laneWidth;
    obstacles.push({ x: laneX, y: -60, w: 35, h: 55 });
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += speed + 2;
    if (obstacles[i].y > canvas.height + 60) { obstacles.splice(i, 1); score += 5; continue; }
    if (player.x < obstacles[i].x + obstacles[i].w && player.x + playerW > obstacles[i].x && player.y < obstacles[i].y + obstacles[i].h && player.y + playerH > obstacles[i].y) {
      gameOver = true; msgEl.innerHTML = 'Game Over!<br>Score: ' + score + '<br>Press R to restart'; msgEl.style.display = 'block';
    }
  }
  scoreEl.textContent = 'Score: ' + score;
}

function draw() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#555';
  ctx.fillRect(50, 0, canvas.width - 100, canvas.height);
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([30, 20]);
  ctx.lineDashOffset = -roadOffset;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(50 + i * laneWidth, 0); ctx.lineTo(50 + i * laneWidth, canvas.height); ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.fillStyle = '${config.playerColor}';
  ctx.fillRect(player.x, player.y, playerW, playerH);
  ctx.fillStyle = '${config.enemyColor}';
  for (const o of obstacles) ctx.fillRect(o.x, o.y, o.w, o.h);
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'Racing', config.backgroundColor, script);
  },
};

const puzzleTemplate: GameTemplate = {
  id: 'puzzle-match3',
  name: 'Puzzle Match3',
  genre: 'puzzle',
  keywords: ['puzzle', 'match', 'match3', 'candy', 'gem', 'swap', 'grid', 'tile', 'jewel'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 560;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let score = 0;
const cols = 8, rows = 8;
const tileSize = 55;
const offsetX = 20, offsetY = 40;
const colors = ['${config.playerColor}', '${config.enemyColor}', '${config.accentColor}', '#ff6600', '#00ccff', '#cc44ff'];
let grid = [];
let selected = null;
let animating = false;

function initGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = Math.floor(Math.random() * colors.length);
    }
  }
  while (findMatches().length > 0) {
    for (const m of findMatches()) { grid[m.r][m.c] = Math.floor(Math.random() * colors.length); }
  }
}

function findMatches() {
  const matches = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      if (grid[r][c] === grid[r][c+1] && grid[r][c] === grid[r][c+2]) {
        matches.push({r,c},{r,c:c+1},{r,c:c+2});
      }
    }
  }
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      if (grid[r][c] === grid[r+1][c] && grid[r][c] === grid[r+2][c]) {
        matches.push({r,c},{r:r+1,c},{r:r+2,c});
      }
    }
  }
  const unique = [];
  const seen = new Set();
  for (const m of matches) {
    const key = m.r + ',' + m.c;
    if (!seen.has(key)) { seen.add(key); unique.push(m); }
  }
  return unique;
}

function removeMatches() {
  const matches = findMatches();
  if (matches.length === 0) return false;
  score += matches.length * 10;
  for (const m of matches) grid[m.r][m.c] = -1;
  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r][c] !== -1) { grid[writeRow][c] = grid[r][c]; writeRow--; }
    }
    for (let r = writeRow; r >= 0; r--) { grid[r][c] = Math.floor(Math.random() * colors.length); }
  }
  return true;
}

function swap(r1, c1, r2, c2) {
  const tmp = grid[r1][c1]; grid[r1][c1] = grid[r2][c2]; grid[r2][c2] = tmp;
}

canvas.addEventListener('click', (e) => {
  if (animating) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left - offsetX;
  const my = e.clientY - rect.top - offsetY;
  const c = Math.floor(mx / tileSize);
  const r = Math.floor(my / tileSize);
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;

  if (!selected) { selected = {r, c}; }
  else {
    const dr = Math.abs(selected.r - r), dc = Math.abs(selected.c - c);
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      swap(selected.r, selected.c, r, c);
      if (findMatches().length === 0) { swap(selected.r, selected.c, r, c); }
      else {
        animating = true;
        setTimeout(function resolve() {
          if (removeMatches()) setTimeout(resolve, 200);
          else { animating = false; scoreEl.textContent = 'Score: ' + score; }
        }, 200);
      }
    }
    selected = null;
  }
});

document.addEventListener('keydown', (e) => { if (e.key === 'r' || e.key === 'R') { score = 0; initGrid(); scoreEl.textContent = 'Score: 0'; } });

initGrid();

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = offsetX + c * tileSize, y = offsetY + r * tileSize;
      ctx.fillStyle = grid[r][c] >= 0 ? colors[grid[r][c]] : '#222';
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
      if (selected && selected.r === r && selected.c === c) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();
`;
    return wrapGame(config.title || 'Puzzle Match3', config.backgroundColor, script);
  },
};

const rpgTemplate: GameTemplate = {
  id: 'rpg-topdown',
  name: 'RPG Top-down',
  genre: 'rpg',
  keywords: ['rpg', 'adventure', 'explore', 'quest', 'dungeon', 'sword', 'fight', 'combat', 'hero', 'fantasy', 'zelda'],
  generateCode: (config: GameConfig): string => {
    const script = `
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;
const scoreEl = document.getElementById('score');
const msgEl = document.getElementById('message');

let gameOver = false;
let score = 0;
const speed = ${config.speed};
const playerSize = ${config.size};
const player = { x: 300, y: 240, w: playerSize, h: playerSize, hp: 100, attacking: false, attackTimer: 0, dir: 0 };
const enemies = [];
const potions = [];
const keys = {};
let killCount = 0;

function spawnEnemies() {
  for (let i = 0; i < ${config.difficulty === 'easy' ? 4 : config.difficulty === 'hard' ? 10 : 6}; i++) {
    enemies.push({ x: Math.random() * (canvas.width - 30), y: Math.random() * (canvas.height - 30), w: 25, h: 25, hp: 30, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
  }
  for (let i = 0; i < 3; i++) {
    potions.push({ x: Math.random() * (canvas.width - 15), y: Math.random() * (canvas.height - 15), w: 15, h: 15 });
  }
}
spawnEnemies();

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'r' || e.key === 'R') restart();
  if (e.key === ' ') { player.attacking = true; player.attackTimer = 15; }
});
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function restart() {
  gameOver = false; score = 0; killCount = 0; player.x = 300; player.y = 240; player.hp = 100;
  enemies.length = 0; potions.length = 0; spawnEnemies();
  msgEl.style.display = 'none';
}

function getAttackBox() {
  const aw = 40, ah = 40;
  if (player.dir === 0) return { x: player.x - 10, y: player.y - ah, w: player.w + 20, h: ah };
  if (player.dir === 1) return { x: player.x - 10, y: player.y + player.h, w: player.w + 20, h: ah };
  if (player.dir === 2) return { x: player.x - aw, y: player.y - 5, w: aw, h: player.h + 10 };
  return { x: player.x + player.w, y: player.y - 5, w: aw, h: player.h + 10 };
}

function update() {
  if (gameOver) return;
  if (keys['ArrowUp'] || keys['w']) { player.y -= speed; player.dir = 0; }
  if (keys['ArrowDown'] || keys['s']) { player.y += speed; player.dir = 1; }
  if (keys['ArrowLeft'] || keys['a']) { player.x -= speed; player.dir = 2; }
  if (keys['ArrowRight'] || keys['d']) { player.x += speed; player.dir = 3; }
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

  if (player.attacking) {
    player.attackTimer--;
    if (player.attackTimer <= 0) player.attacking = false;
    const ab = getAttackBox();
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (ab.x < e.x + e.w && ab.x + ab.w > e.x && ab.y < e.y + e.h && ab.y + ab.h > e.y) {
        e.hp -= 15;
        if (e.hp <= 0) { enemies.splice(i, 1); score += 25; killCount++; }
      }
    }
  }

  for (const e of enemies) {
    e.x += e.vx; e.y += e.vy;
    if (e.x < 0 || e.x > canvas.width - e.w) e.vx *= -1;
    if (e.y < 0 || e.y > canvas.height - e.h) e.vy *= -1;
    if (e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) {
      player.hp -= 0.5;
    }
  }

  for (let i = potions.length - 1; i >= 0; i--) {
    const p = potions[i];
    if (player.x < p.x + p.w && player.x + player.w > p.x && player.y < p.y + p.h && player.y + player.h > p.y) {
      player.hp = Math.min(100, player.hp + 30); potions.splice(i, 1);
    }
  }

  if (player.hp <= 0) { gameOver = true; msgEl.innerHTML = 'Game Over!<br>Kills: ' + killCount + '<br>Press R to restart'; msgEl.style.display = 'block'; }
  if (enemies.length === 0) { score += 100; enemies.length = 0; potions.length = 0; spawnEnemies(); }
  scoreEl.textContent = 'HP: ' + Math.floor(player.hp) + ' | Score: ' + score;
}

function draw() {
  ctx.fillStyle = '${config.backgroundColor}';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '${config.playerColor}';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  if (player.attacking) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const ab = getAttackBox();
    ctx.fillRect(ab.x, ab.y, ab.w, ab.h);
  }
  ctx.fillStyle = '${config.enemyColor}';
  for (const e of enemies) ctx.fillRect(e.x, e.y, e.w, e.h);
  ctx.fillStyle = '${config.accentColor}';
  for (const p of potions) ctx.fillRect(p.x, p.y, p.w, p.h);
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
`;
    return wrapGame(config.title || 'RPG Adventure', config.backgroundColor, script);
  },
};

export const gameTemplates: GameTemplate[] = [
  platformerTemplate,
  spaceShooterTemplate,
  snakeTemplate,
  flappyBirdTemplate,
  breakoutTemplate,
  racingTemplate,
  puzzleTemplate,
  rpgTemplate,
];

export function getTemplateByGenre(genre: string): GameTemplate | undefined {
  return gameTemplates.find(t => t.genre === genre) ||
    gameTemplates.find(t => t.keywords.some(k => genre.toLowerCase().includes(k)));
}

export function getTemplateByKeywords(keywords: string[]): GameTemplate | undefined {
  let bestMatch: GameTemplate | undefined;
  let bestScore = 0;
  for (const template of gameTemplates) {
    let matchScore = 0;
    for (const kw of keywords) {
      if (template.keywords.some(tk => tk.includes(kw) || kw.includes(tk))) matchScore++;
      if (template.genre.includes(kw) || template.name.toLowerCase().includes(kw)) matchScore += 2;
    }
    if (matchScore > bestScore) { bestScore = matchScore; bestMatch = template; }
  }
  return bestMatch;
}

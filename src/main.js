import { createLoop } from './loop.js';
import { createInput } from './input.js';
import { integrate } from './physics.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');

const dpr = window.devicePixelRatio || 1;
const width = window.innerWidth;
const height = window.innerHeight;

// Налаштування Canvas під dpr
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
ctx.scale(dpr, dpr);

let ship = { x: width / 2, y: height / 2, vx: 0, vy: 0, angle: 0 };
let previousShip = { ...ship };

const getInput = createInput();

function update(dt) {
  previousShip = { ...ship };
  const input = getInput();
  ship = integrate(ship, input, dt);
  
  // Загортання країв екрана
  if (ship.x < 0) ship.x = width;
  else if (ship.x > width) ship.x = 0;
  
  if (ship.y < 0) ship.y = height;
  else if (ship.y > height) ship.y = 0;
}

function render(alpha) {
  // формула інтерполяції
  const renderX = previousShip.x * (1 - alpha) + ship.x * alpha;
  const renderY = previousShip.y * (1 - alpha) + ship.y * alpha;

  ctx.clearRect(0, 0, width, height);
  
  ctx.save();
  ctx.translate(renderX, renderY);//"центр всесвіту" там, де корабель.
  ctx.rotate(ship.angle);
  
  // Малюємо трикутник (корабель)
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(-10, 10);
  ctx.lineTo(-10, -10);
  ctx.closePath();
  
  ctx.fillStyle = '#00ffcc';
  ctx.fill();
  ctx.restore();//повертаємо "всесвіт" у нормальний стан для наступного кадру
}

function updateHUD(steps, frames, frameTimeMs) {
  hud.innerText = `Steps/s (Physics): ${steps}\nFrames/s (Render): ${frames}\nFrame Time: ${frameTimeMs} ms`;
}

createLoop(update, render, updateHUD);
let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let boids;
let boidCount = 500;

let walls;

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
}

function init() {
  boids = [];
  walls = [];
  iniBoids(boidCount);
  render();
}

function iniBoids(count) {
  for (let i = 0; i < count; i++) {
    let posX = window.innerWidth * pickRandomBetweenTwoValues(0.1, 0.9);
    let posY = window.innerHeight * pickRandomBetweenTwoValues(0.1, 0.9);
    boids.push(new Boid(posX, posY));
  }
}

function pickBetweenTwoValues(valOne, valTwo) {
  return parseInt(Math.random() * 2) ? valOne : valTwo;
}

function pickRandomBetweenTwoValues(valOne, valTwo) {
  return valOne + Math.random() * (valTwo - valOne);
}
function render() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  if (checkIfResized()) {
    resizeCanvas();
    return;
  }

  boids.forEach((boid) => {
    boid.draw();
    boid.move();
    boid.flock(boids);
    boid.avoidWalls(walls);
  });

  walls.forEach((wall) => {
    wall.draw();
  });

  requestAnimationFrame(render);
}

initCtx();
init();

canvas.addEventListener("click", (event) => {
  let wallX = event.clientX;
  let wallY = event.clientY;

  walls.push(new Wall(wallX, wallY, 30));
});

class Wall {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.closePath();
  }
}

function checkIfResized() {
  return windowH !== window.innerHeight || windowW !== window.innerWidth
    ? true
    : false;
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  windowW = window.innerWidth;
  windowH = window.innerHeight;
  init();
}

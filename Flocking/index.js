let windowW = window.innerWidth;
let windowH = window.innerHeight;

let canvas;
let ctx;
let boids;
let radius = 4;

function initCtx() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
}

function init() {
  boids = [];
  iniBoids(500);
  render();
}

function iniBoids(count) {
  for (let i = 0; i < count; i++) {
    let posX = window.innerWidth * Math.random();
    let posY = window.innerHeight * Math.random();
    boids.push(new Boid(posX, posY));
  }
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
  });

  requestAnimationFrame(render);
}

initCtx();
init();

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

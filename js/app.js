const game = document.querySelector("#game");
const sambosaEl = document.querySelector("#sambosa");
const screenEl = document.querySelector("#screen");
const titleEl = document.querySelector("#title");
const playBtn = document.querySelector("#play-btn");
const scoreEl = document.querySelector("#score");
const goalEl = document.querySelector("#goal");
const bestEl = document.querySelector("#best");

let state = "start"; // start, playing, over
let sambosa = { y: 0, velocity: 0 };
let fires = [];
let score = 0;
let speed = settings.startSpeed;
let loop = null;
let endTime = 0;

// these depend on the screen size
let width = 0;
let height = 0;
let oilLine = 0;
let sambosaLeft = 0;

// best score is saved in the browser
let best = Number(localStorage.getItem("sambosaBest")) || 0;
goalEl.textContent = settings.winScore;
bestEl.textContent = best;

function updateSizes() {
  width = game.clientWidth;
  height = game.clientHeight;
  oilLine = height * settings.oilLevel;
  sambosaLeft = width * settings.sambosaX;
  sambosaEl.style.left = sambosaLeft + "px";
}

function startGame() {
  // remove the fire from the last round
  fires.forEach((f) => {
    f.top.remove();
    f.bottom.remove();
  });
  fires = [];

  updateSizes();
  score = 0;
  speed = settings.startSpeed;
  sambosa.y = height * 0.35;
  sambosa.velocity = 0;
  scoreEl.textContent = score;

  sambosaEl.classList.remove("idle", "fried");
  game.classList.remove("shake");
  screenEl.style.display = "none";
  playBtn.blur();
  state = "playing";

  addFire();
  clearInterval(loop);
  loop = setInterval(update, 16);
}

function jump() {
  if (state !== "playing") return;
  sambosa.velocity = settings.jumpPower;
}

// runs every frame
function update() {
  // gravity pulls the sambosa down a bit more every frame
  sambosa.velocity += settings.gravity;
  if (sambosa.velocity > settings.maxFall) sambosa.velocity = settings.maxFall;
  sambosa.y += sambosa.velocity;

  // stop it from flying off the top
  if (sambosa.y < 0) {
    sambosa.y = 0;
    sambosa.velocity = 0;
  }

  moveFires();
  drawSambosa();

  if (sambosa.y + settings.sambosaSize > oilLine) {
    endGame("oil");
  } else if (hitFire()) {
    endGame("fire");
  } else if (score >= settings.winScore) {
    endGame("win");
  }
}

function drawSambosa() {
  // tilt using the same speed: up when jumping, down when falling
  let angle = sambosa.velocity * 4;
  if (angle < -25) angle = -25;
  if (angle > 45) angle = 45;

  sambosaEl.style.top = sambosa.y + "px";
  sambosaEl.style.transform = `rotate(${angle}deg)`;
}

function addFire() {
  // random height for the gap
  const minTop = 60;
  const maxTop = oilLine - settings.gapSize - 60;
  const gapTop = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

  const top = document.createElement("div");
  top.classList.add("fire", "from-top");
  top.style.top = "0px";
  top.style.height = gapTop + "px";

  // this one comes out of the pan, +40 so it starts inside the oil
  const bottom = document.createElement("div");
  bottom.classList.add("fire", "from-pan");
  bottom.style.top = gapTop + settings.gapSize + "px";
  bottom.style.height = oilLine - gapTop - settings.gapSize + 40 + "px";

  top.style.left = width + "px";
  bottom.style.left = width + "px";
  game.append(top, bottom);

  fires.push({ x: width, gapTop, passed: false, top, bottom });
}

function moveFires() {
  // new pair when the last one moved far enough
  const last = fires[fires.length - 1];
  if (!last || last.x < width - settings.fireSpacing) {
    addFire();
  }

  fires.forEach((f) => {
    f.x -= speed;
    f.top.style.left = f.x + "px";
    f.bottom.style.left = f.x + "px";

    // sambosa passed this pair
    if (!f.passed && f.x + settings.fireWidth < sambosaLeft) {
      f.passed = true;
      score++;
      scoreEl.textContent = score;
      speed += 0.15; // a bit faster every point
    }
  });

  // remove the first pair when it leaves the screen
  const first = fires[0];
  if (first.x < -settings.fireWidth) {
    first.top.remove();
    first.bottom.remove();
    fires.shift();
  }
}

function hitFire() {
  // the sambosa is a triangle so the corners are empty,
  // pad makes the hitbox smaller so it feels fair
  const pad = 12;
  const left = sambosaLeft + pad;
  const right = sambosaLeft + settings.sambosaSize - pad;
  const top = sambosa.y + pad;
  const bottom = sambosa.y + settings.sambosaSize - pad;

  // the fire picture is thinner than its box, so skip 15px on each side
  for (const f of fires) {
    const insideX = right > f.x + 15 && left < f.x + settings.fireWidth - 15;
    const outsideGap = top < f.gapTop || bottom > f.gapTop + settings.gapSize;
    if (insideX && outsideGap) return true;
  }
  return false;
}

function endGame(result) {
  state = "over";
  clearInterval(loop);
  endTime = Date.now();

  if (score > best) {
    best = score;
    localStorage.setItem("sambosaBest", best);
    bestEl.textContent = best;
  }

  if (result === "win") {
    titleEl.textContent = messages.win;
  } else {
    titleEl.textContent = messages.lose;
    game.classList.add("shake");
  }

  if (result === "oil") {
    sambosaEl.classList.add("fried");
    sambosaEl.style.top = oilLine + "px"; // sink into the oil
  }

  playBtn.textContent = "↻ Play Again";
  screenEl.style.display = "flex";
}

updateSizes();
window.addEventListener("resize", updateSizes);

playBtn.addEventListener("click", startGame);
game.addEventListener("pointerdown", jump);

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  e.preventDefault(); // stop the page from scrolling

  if (state === "playing") {
    jump();
  } else if (Date.now() - endTime > 700) {
    // small wait so you don't restart by accident
    startGame();
  }
});

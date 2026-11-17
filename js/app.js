// ---------- settings (change numbers here) ----------
const settings = {
  oilLevel: 0.69, // oil starts at 69% of the screen height
  gravity: 0.45,
  jumpPower: -8,
  maxFall: 10,

  sambosaX: 0.15, // 15% from the left
  sambosaSize: 80, // normal size
  bigSize: 130, // size after eating a mini sambosa

  fireWidth: 90,
  gapSize: 200,
  fireSpacing: 380,

  miniSize: 40,
  miniChance: 0.4, // chance of a mini sambosa per fire pair

  startSpeed: 3.5,
  speedUp: 0.15, // speed added each time you pass a fire

  winScore: 20,
  changeBgEvery: 5, // new background every 5 points
  backgrounds: ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg'],
}

const messages = { win: 'You Win! 🎉', lose: 'Game Over' }

// ---------- elements ----------
const game = document.querySelector('#game')
const sambosaEl = document.querySelector('#sambosa')
const screenEl = document.querySelector('#screen')
const titleEl = document.querySelector('#title')
const playBtn = document.querySelector('#play-btn')
const timerEl = document.querySelector('#timer')
const scoreEl = document.querySelector('#score')
const goalEl = document.querySelector('#goal')
const bestEl = document.querySelector('#best')

// ---------- game state ----------
let state = 'start' // start, playing, over
let sambosa = { y: 0, velocity: 0, big: false }
let fires = [] // each pair: { x, gapTop, passed, top, bottom }
let minis = [] // each mini: { x, y, el }
let score = 0
let timer = 0
let speed = 0
let bgIndex = 0
let loop = null
let endTime = 0
let width = 0
let height = 0
let oilLine = 0
let sambosaLeft = 0
let best = Number(localStorage.getItem('sambosaBest')) || 0

goalEl.textContent = settings.winScore
bestEl.textContent = best

// ---------- helpers ----------
function updateSizes() {
  width = game.clientWidth
  height = game.clientHeight
  oilLine = height * settings.oilLevel
  sambosaLeft = width * settings.sambosaX
  sambosaEl.style.left = sambosaLeft + 'px'
}

function mySize() {
  return sambosa.big ? settings.bigSize : settings.sambosaSize
}

function setSize() {
  sambosaEl.style.width = mySize() + 'px'
}

// the picture changes at 5, 10, 15 points, and starts again at 15
function updateBackground() {
  const index = Math.floor(score / settings.changeBgEvery) % settings.backgrounds.length
  if (index !== bgIndex) {
    bgIndex = index
    game.style.backgroundImage = `url('${settings.backgrounds[index]}')`
  }
}

// ---------- round setup ----------
function clearRound() {
  fires.forEach(f => {
    f.top.remove()
    f.bottom.remove()
  })
  minis.forEach(m => m.el.remove())
  fires = []
  minis = []
}

function startGame() {
  clearRound()
  updateSizes()

  score = 0
  timer = 0
  speed = settings.startSpeed
  bgIndex = 0
  sambosa = { y: height * 0.35, velocity: 0, big: false }

  setSize()
  scoreEl.textContent = 0
  timerEl.textContent = '0.0'
  game.style.backgroundImage = `url('${settings.backgrounds[0]}')`

  sambosaEl.classList.remove('idle', 'fried')
  game.classList.remove('shake')
  screenEl.style.display = 'none'
  playBtn.blur()
  state = 'playing'

  addFire()
  clearInterval(loop)
  loop = setInterval(update, 16)
}

function jump() {
  if (state === 'playing') sambosa.velocity = settings.jumpPower
}

// ---------- main loop (runs every 16 ms) ----------
function update() {
  timer += 0.016
  timerEl.textContent = timer.toFixed(1)

  // gravity pulls down, jump pushes up
  sambosa.velocity = Math.min(sambosa.velocity + settings.gravity, settings.maxFall)
  sambosa.y = Math.max(0, sambosa.y + sambosa.velocity)

  moveFires()
  moveMinis()
  drawSambosa()

  // touching the oil ends the game
  if (sambosa.y + mySize() > oilLine) return endGame('oil')

  // touching fire: a big sambosa shrinks, a small one loses
  const hit = hitFireIndex()
  if (hit !== -1) {
    if (!sambosa.big) return endGame('fire')
    shrink()
    removeFire(hit)
  }

  eatMinis()
  if (score >= settings.winScore) endGame('win')
}

function drawSambosa() {
  // tilt up when jumping, down when falling
  const angle = Math.max(-25, Math.min(45, sambosa.velocity * 4))
  sambosaEl.style.top = sambosa.y + 'px'
  sambosaEl.style.transform = `rotate(${angle}deg)`
}

// ---------- fire ----------
function makeFirePart(sideClass, top, height) {
  const el = document.createElement('div')
  el.classList.add('fire', sideClass)
  el.style.top = top + 'px'
  el.style.height = height + 'px'
  el.style.left = width + 'px'
  game.append(el)
  return el
}

function addFire() {
  const minTop = 60
  const maxTop = oilLine - settings.gapSize - 60
  const gapTop = minTop + Math.floor(Math.random() * (maxTop - minTop))
  const gapBottom = gapTop + settings.gapSize

  const top = makeFirePart('from-top', 0, gapTop)
  // bottom fire comes out of the pan, so it goes 40px into the oil
  const bottom = makeFirePart('from-pan', gapBottom, oilLine - gapBottom + 40)

  fires.push({ x: width, gapTop, passed: false, top, bottom })

  if (Math.random() < settings.miniChance) {
    spawnMini(width + settings.fireSpacing / 2)
  }
}

function moveFires() {
  const last = fires[fires.length - 1]
  if (!last || last.x < width - settings.fireSpacing) addFire()

  fires.forEach(f => {
    f.x -= speed
    f.top.style.left = f.x + 'px'
    f.bottom.style.left = f.x + 'px'

    // sambosa passed this pair
    if (!f.passed && f.x + settings.fireWidth < sambosaLeft) {
      f.passed = true
      score++
      scoreEl.textContent = score
      speed += settings.speedUp
      updateBackground()
    }
  })

  // remove the first pair once it is off the screen
  if (fires[0].x < -settings.fireWidth) removeFire(0)
}

function removeFire(index) {
  fires[index].top.remove()
  fires[index].bottom.remove()
  fires.splice(index, 1)
}

// returns the index of the fire we hit, or -1
function hitFireIndex() {
  const size = mySize()
  const pad = 12 // smaller hit box, so it feels fair
  const left = sambosaLeft + pad
  const right = sambosaLeft + size - pad
  const top = sambosa.y + pad
  const bottom = sambosa.y + size - pad

  // the fire picture is thinner than its box, so skip 15px on each side
  return fires.findIndex(f => {
    const insideX = right > f.x + 15 && left < f.x + settings.fireWidth - 15
    const outsideGap = top < f.gapTop || bottom > f.gapTop + settings.gapSize
    return insideX && outsideGap
  })
}

// ---------- mini sambosas ----------
function spawnMini(x) {
  const y = 60 + Math.random() * (oilLine - 150)

  const el = document.createElement('img')
  el.src = './images/sambosa.png'
  el.className = 'mini'
  el.style.width = settings.miniSize + 'px'
  el.style.left = x + 'px'
  el.style.top = y + 'px'
  game.append(el)

  minis.push({ x, y, el })
}

function moveMinis() {
  minis.forEach(m => {
    m.x -= speed
    m.el.style.left = m.x + 'px'
  })

  // keep only the minis still on the screen
  minis = minis.filter(m => {
    if (m.x < -settings.miniSize) {
      m.el.remove()
      return false
    }
    return true
  })
}

// box overlap check: touching a mini makes the sambosa big
function eatMinis() {
  const size = mySize()
  minis = minis.filter(m => {
    const touching =
      sambosaLeft < m.x + settings.miniSize && sambosaLeft + size > m.x &&
      sambosa.y < m.y + settings.miniSize && sambosa.y + size > m.y

    if (touching) {
      sambosa.big = true
      setSize()
      m.el.remove()
    }
    return !touching
  })
}

function shrink() {
  sambosa.big = false
  setSize()
  sambosaEl.classList.add('shake')
  setTimeout(() => sambosaEl.classList.remove('shake'), 400)
}

// ---------- end of round ----------
function endGame(result) {
  state = 'over'
  clearInterval(loop)
  endTime = Date.now()

  if (score > best) {
    best = score
    localStorage.setItem('sambosaBest', best)
    bestEl.textContent = best
  }

  titleEl.textContent = result === 'win' ? messages.win : messages.lose
  if (result !== 'win') game.classList.add('shake')

  if (result === 'oil') {
    sambosaEl.classList.add('fried')
    sambosaEl.style.top = oilLine + 'px' // sink into the oil
  }

  playBtn.textContent = '↻ Play Again'
  screenEl.style.display = 'flex'
}

// ---------- controls ----------
updateSizes()
window.addEventListener('resize', updateSizes)

playBtn.addEventListener('click', startGame)
game.addEventListener('pointerdown', jump)

document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return
  e.preventDefault() // stop the page from scrolling

  if (state === 'playing') {
    jump()
  } else if (Date.now() - endTime > 700) {
    // short wait so you don't restart by accident
    startGame()
  }
})
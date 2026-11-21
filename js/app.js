// settings 
const settings = {
  oilLevel: 0.69, 
  gravity: 0.45,
  jumpPower: -8,
  maxFall: 10, 
  sambosaX: 0.15, 
  sambosaSize: 80,
  bigSize: 130, 
  fireWidth: 100,
  gapSize: 200, 
  fireSpacing: 380, 
  miniSize: 40,
  miniChance: 0.4,
  startSpeed: 3.5,
  speedUp: 0.15, 
  winScore: 20,
  backgrounds: ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg'],
}

//  elements 
const game = document.querySelector('#game')
const sambosaEl = document.querySelector('#sambosa')
const screenEl = document.querySelector('#screen')
const titleEl = document.querySelector('#title')
const playBtn = document.querySelector('#play-btn')
const timerEl = document.querySelector('#timer')
const scoreEl = document.querySelector('#score')
const bestEl = document.querySelector('#best')
document.querySelector('#goal').textContent = settings.winScore

//  game state 
let state = 'start'
let sambosa = { y: 0, velocity: 0, big: false }
let fires = [] 
let minis = [] 
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
bestEl.textContent = best

//  helpers 
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

function setBig(isBig) {
  sambosa.big = isBig
  sambosaEl.style.width = mySize() + 'px'
}

function setBackground(index) {
  bgIndex = index
  game.style.backgroundImage = `url('${settings.backgrounds[index]}')`
}

function kill(thing) {
  thing.els.forEach(el => el.remove())
  thing.dead = true
}

//  start the round 
function startGame() {
  updateSizes()
  fires.concat(minis).forEach(kill)
  fires = []
  minis = []

  score = 0
  timer = 0
  speed = settings.startSpeed
  sambosa = { y: height * 0.35, velocity: 0, big: false }
  setBig(false)

  scoreEl.textContent = 0
  timerEl.textContent = '0.0'
  setBackground(0)
  sambosaEl.classList.remove('idle', 'fried')
  game.classList.remove('shake')
  screenEl.style.display = 'none'
  playBtn.blur()
  state = 'playing'

  clearInterval(loop)
  loop = setInterval(update, 16)
}

function jump() {
  if (state === 'playing') sambosa.velocity = settings.jumpPower
}

//  main loop 
function update() {
  timer += 0.016
  timerEl.textContent = timer.toFixed(1)

  // gravity pulls down, jump pushes up
  sambosa.velocity = Math.min(sambosa.velocity + settings.gravity, settings.maxFall)
  sambosa.y = Math.max(0, sambosa.y + sambosa.velocity)
  const angle = Math.max(-25, Math.min(45, sambosa.velocity * 4))
  sambosaEl.style.top = sambosa.y + 'px'
  sambosaEl.style.transform = `rotate(${angle}deg)`

  // add a new pair of fires when the last one moved far enough
  const last = fires[fires.length - 1]
  if (!last || last.x < width - settings.fireSpacing) addFire()

  fires = move(fires)
  minis = move(minis)
  countScore()

  if (sambosa.y + mySize() > oilLine) return endGame('oil')

  // touching fire: a big sambosa shrinks, a small one loses
  const hit = hitFire()
  if (hit) {
    if (!sambosa.big) return endGame('fire')
    setBig(false)
    kill(hit)
  }

  eatMinis()
  if (score >= settings.winScore) endGame('win')
}

// move everything left, remove what left the screen
function move(list) {
  list.forEach(thing => {
    thing.x -= speed
    thing.els.forEach(el => (el.style.left = thing.x + 'px'))
    if (thing.x < -settings.fireWidth) kill(thing)
  })
  return list.filter(thing => !thing.dead)
}

//  fire 
// the fire is a video (a flame animation that loops)
function makeFire(side, top, fireHeight) {
  const el = document.createElement('video')
  el.src = './images/fire.mp4'
  el.className = 'fire ' + side
  el.muted = el.loop = el.playsInline = true
  el.style.width = settings.fireWidth + 'px'
  el.style.top = top + 'px'
  el.style.height = fireHeight + 'px'
  el.style.left = width + 'px'
  el.currentTime = Math.random() * 6 // so the flames don't all move together
  el.play()
  game.append(el)
  return el
}

function addFire() {
  const gapTop = 60 + Math.random() * (oilLine - settings.gapSize - 120)
  const gapBottom = gapTop + settings.gapSize

  fires.push({
    x: width,
    gapTop: gapTop,
    passed: false,
    els: [
      makeFire('from-top', 0, gapTop), // fire hanging from the top
      makeFire('from-pan', gapBottom, oilLine - gapBottom + 40), // fire from the pan
    ],
  })

  // sometimes put a mini sambosa between this pair and the next one
  if (Math.random() < settings.miniChance) addMini(width + settings.fireSpacing / 2)
}

// +1 score when the sambosa passes a fire, and change the background every 5
function countScore() {
  fires.forEach(f => {
    if (f.passed || f.x + settings.fireWidth > sambosaLeft) return
    f.passed = true
    score++
    speed += settings.speedUp
    scoreEl.textContent = score

    setBackground(Math.floor(score / 5) % settings.backgrounds.length)
  })
}

// returns the fire we hit, or undefined
function hitFire() {
  const pad = 18 // smaller hit box so it feels fair
  const left = sambosaLeft + pad
  const right = sambosaLeft + mySize() - pad
  const top = sambosa.y + pad
  const bottom = sambosa.y + mySize() - pad

  return fires.find(f => {
    const insideX = right > f.x + 25 && left < f.x + settings.fireWidth - 25
    const outsideGap = top < f.gapTop || bottom > f.gapTop + settings.gapSize
    return insideX && outsideGap
  })
}

//  mini sambosas 
function addMini(x) {
  const y = 60 + Math.random() * (oilLine - 150)
  const el = document.createElement('img')
  el.src = './images/sambosa.png'
  el.className = 'mini'
  el.style.width = settings.miniSize + 'px'
  el.style.top = y + 'px'
  game.append(el)
  minis.push({ x: x, y: y, els: [el] })
}

// ---------- elements ----------
const game = document.querySelector('#game')
const backdropEl = document.querySelector('#backdrop')
const flamesEl = document.querySelector('#flames')
const sambosaEl = document.querySelector('#sambosa')
const screenEl = document.querySelector('#screen')
const titleEl = document.querySelector('#title')
const playBtn = document.querySelector('#play-btn')
const timerEl = document.querySelector('#timer')
const scoreEl = document.querySelector('#score')
const bestEl = document.querySelector('#best')
const muteBtn = document.querySelector('#mute-btn')
document.querySelector('#goal').textContent = settings.winScore

// ---------- game state ----------
let state = 'start' // start, playing, over
let sambosa = { y: 0, velocity: 0, size: settings.startSize }
let fires = [] // each fire: { x, gapTop, passed, els: [topVideo, bottomVideo] }
let minis = [] // each mini: { x, y, els: [image] }
let score = 0
let timer = 0
let speed = 0
let wobble = 0 // counts up each frame to move the wobble
let bgIndex = 0
let loop = null
let endTime = 0
let width = 0
let height = 0
let oilLine = 0
let sambosaLeft = 0
let best = Number(localStorage.getItem('sambosaBest')) || 0
let muted = false
const crackle = new Audio(sounds.crackle.file)
crackle.loop = true
crackle.volume = sounds.crackle.volume
bestEl.textContent = best

// ---------- helpers ----------
function updateSizes() {
  width = game.clientWidth
  height = game.clientHeight
  oilLine = height * settings.oilLevel
  sambosaLeft = width * settings.sambosaX
  sambosaEl.style.left = sambosaLeft + 'px'
}

// change the sambosa's size (in pixels)
function setSize(newSize) {
  sambosa.size = newSize
  sambosaEl.style.width = newSize + 'px'
}

function setBackground(index) {
  bgIndex = index
  const bg = backgrounds[index]
  backdropEl.style.backgroundImage = `url('${bg.image}')`
  backdropEl.setAttribute('aria-label', bg.alt)
  flamesEl.style.left = bg.flames.left + '%'
  flamesEl.style.top = bg.flames.top + '%'
  flamesEl.style.width = bg.flames.width + '%'
  flamesEl.style.height = bg.flames.height + '%'
}

// a new Audio each time, so the same sound can play on top of itself
function playSound(name) {
  if (muted) return
  const audio = new Audio(sounds[name].file)
  audio.volume = sounds[name].volume
  audio.play().catch(() => {}) // ignore it if the browser blocks the sound
}

// the fire crackle plays only while you are playing and not muted
function updateCrackle() {
  if (state === 'playing' && !muted) crackle.play().catch(() => {})
  else crackle.pause()
}

function setMuted(value) {
  muted = value
  localStorage.setItem('sambosaMuted', muted)
  muteBtn.setAttribute('aria-pressed', muted)
  muteBtn.firstElementChild.textContent = muted ? '🔇' : '🔊'
  updateCrackle()
}

function kill(thing) {
  thing.els.forEach(el => el.remove())
  thing.dead = true
}

// ---------- start the round ----------
function startGame() {
  updateSizes()
  fires.concat(minis).forEach(kill)
  fires = []
  minis = []

  score = 0
  timer = 0
  wobble = 0
  speed = settings.startSpeed
  sambosa = { y: height * 0.35, velocity: 0, size: settings.startSize }
  setSize(settings.startSize)

  scoreEl.textContent = 0
  timerEl.textContent = '0.0'
  setBackground(0)
  sambosaEl.classList.remove('idle', 'fried')
  game.classList.remove('shake')
  screenEl.style.display = 'none'
  playBtn.blur()
  state = 'playing'
  updateCrackle()

  clearInterval(loop)
  loop = setInterval(update, 16) // about 60 times per second
}

function jump() {
  if (state !== 'playing') return
  sambosa.velocity = settings.jumpPower
  playSound('jump')
}

// ---------- main loop ----------
function update() {
  timer += 0.016
  timerEl.textContent = timer.toFixed(1)

  // gravity pulls down, jump pushes up
  sambosa.velocity = Math.min(sambosa.velocity + settings.gravity, settings.maxFall)
  sambosa.y = Math.max(0, sambosa.y + sambosa.velocity)

  // the sambosa wobbles left and right, and wobbles faster as the score grows
  wobble += 0.1 + score * 0.02
  const tilt = Math.max(-25, Math.min(45, sambosa.velocity * 4)) // up when jumping, down when falling
  const angle = tilt + Math.sin(wobble) * 6
  sambosaEl.style.top = sambosa.y + 'px'
  sambosaEl.style.transform = `rotate(${angle}deg)`

  // add a new pair of fires when the last one moved far enough
  const last = fires[fires.length - 1]
  if (!last || last.x < width - settings.fireSpacing) addFire()

  fires = move(fires)
  minis = move(minis)
  countScore()

  if (sambosa.y + sambosa.size > oilLine) return endGame('oil')

  // touching fire: a small sambosa loses, a bigger one shrinks a bit
  const hit = hitFire()
  if (hit) {
    playSound('hurt')
    if (sambosa.size <= settings.startSize) return endGame('fire')
    setSize(sambosa.size - settings.growStep)
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

// ---------- fire ----------
// the fire is a video (a flame animation that loops)
function makeVideo(className) {
  const el = document.createElement('video')
  el.src = './images/fire.mp4'
  el.className = className
  el.muted = el.loop = el.playsInline = el.autoplay = true
  el.setAttribute('aria-hidden', 'true')
  el.currentTime = Math.random() * 6 // so the flames don't all move together
  return el
}

// the flames under the pan, the same video as the fire (paused if you prefer less motion)
function makeFlames() {
  const lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  for (let i = 0; i < settings.flameCount; i++) {
    const el = makeVideo('flame')
    el.autoplay = !lessMotion
    flamesEl.append(el)
  }
}

function makeFire(side, top, fireHeight) {
  const el = makeVideo('fire ' + side)
  el.style.width = settings.fireWidth + 'px'
  el.style.top = top + 'px'
  el.style.height = fireHeight + 'px'
  el.style.left = width + 'px'
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
    if (score < settings.winScore) playSound('point')

    setBackground(Math.floor(score / 5) % backgrounds.length)
  })
}

// returns the fire we hit, or undefined
function hitFire() {
  const pad = 18 // smaller hit box so it feels fair
  const left = sambosaLeft + pad
  const right = sambosaLeft + sambosa.size - pad
  const top = sambosa.y + pad
  const bottom = sambosa.y + sambosa.size - pad

  return fires.find(f => {
    const insideX = right > f.x + 25 && left < f.x + settings.fireWidth - 25
    const outsideGap = top < f.gapTop || bottom > f.gapTop + settings.gapSize
    return insideX && outsideGap
  })
}

// ---------- mini sambosas ----------
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

// touching a mini makes the sambosa grow a little
function eatMinis() {
  minis.forEach(m => {
    const size = sambosa.size
    const touching =
      sambosaLeft < m.x + settings.miniSize && sambosaLeft + size > m.x &&
      sambosa.y < m.y + settings.miniSize && sambosa.y + size > m.y
    if (touching) {
      kill(m)
      playSound('grow')
      setSize(Math.min(settings.maxSize, sambosa.size + settings.growStep))
    }
  })
  minis = minis.filter(m => !m.dead)
}

// ---------- end of round ----------
function endGame(result) {
  state = 'over'
  clearInterval(loop)
  endTime = Date.now()
  updateCrackle()

  if (score > best) {
    best = score
    localStorage.setItem('sambosaBest', best)
    bestEl.textContent = best
  }

  titleEl.textContent = result === 'win' ? messages.win : messages.lose
  playSound(result === 'win' ? 'win' : 'lose')
  if (result !== 'win') game.classList.add('shake')
  if (result === 'oil') {
    sambosaEl.classList.add('fried')
    sambosaEl.style.top = oilLine + 'px' // sink into the oil
    playSound('sizzle')
  }

  playBtn.textContent = messages.playAgain
  screenEl.style.display = 'flex'
}

// ---------- controls ----------
updateSizes()
makeFlames()
setBackground(0) // show the first picture on the start screen
window.addEventListener('resize', updateSizes)
playBtn.addEventListener('click', startGame)
muteBtn.addEventListener('click', () => setMuted(!muted))
setMuted(localStorage.getItem('sambosaMuted') === 'true')
game.addEventListener('pointerdown', jump)

// Space and Up Arrow both make the sambosa jump
document.addEventListener('keydown', e => {
  const isJumpKey = e.code === 'Space' || e.code === 'ArrowUp'
  if (!isJumpKey) return
  if (e.target.tagName === 'BUTTON' && state !== 'playing') return // buttons use Space themselves
  e.preventDefault() // stop the page from scrolling

  if (state === 'playing') jump()
  else if (Date.now() - endTime > 700) startGame() // short wait so you don't restart by accident
})
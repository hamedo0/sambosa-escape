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

// elements 
const game = document.querySelector('#game')
const sambosaEl = document.querySelector('#sambosa')
const screenEl = document.querySelector('#screen')
const titleEl = document.querySelector('#title')
const playBtn = document.querySelector('#play-btn')
const timerEl = document.querySelector('#timer')
const scoreEl = document.querySelector('#score')
const bestEl = document.querySelector('#best')
document.querySelector('#goal').textContent = settings.winScore

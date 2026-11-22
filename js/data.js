// all the settings and data for the game (change numbers here)
const settings = {
  oilLevel: 0.69, // oil starts at 69% of the screen height
  gravity: 0.45,
  jumpPower: -8,
  maxFall: 10, // the sambosa can't fall faster than this
  sambosaX: 0.15, // 15% from the left
  startSize: 45, // size at the start
  growStep: 12, // how much it grows (or shrinks) each time
  maxSize: 120, // it can't grow bigger than this
  fireWidth: 100,
  gapSize: 200, // space between top fire and bottom fire
  fireSpacing: 380, // distance between each pair of fires
  miniSize: 40,
  miniChance: 0.4, // chance of a mini sambosa after each pair
  startSpeed: 3.5,
  speedUp: 0.15, // speed added each time you pass a fire
  winScore: 20,
  backgrounds: ['images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg'],
}

const messages = {
  win: 'You Win! 🎉',
  lose: 'Game Over',
  playAgain: '↻ Play Again',
}

// file and volume (0 to 1) for each sound
const sounds = {
  jump: { file: 'sounds/jump.mp3', volume: 0.5 },
  point: { file: 'sounds/point.mp3', volume: 0.6 },
  grow: { file: 'sounds/grow.mp3', volume: 0.6 },
  hurt: { file: 'sounds/hurt.mp3', volume: 0.7 },
  sizzle: { file: 'sounds/sizzle.mp3', volume: 0.7 },
  lose: { file: 'sounds/lose.mp3', volume: 0.7 },
  win: { file: 'sounds/win.mp3', volume: 0.7 },
  crackle: { file: 'sounds/crackle.mp3', volume: 0.25 }, // loops while you play
}

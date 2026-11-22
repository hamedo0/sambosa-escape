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

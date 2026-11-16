// game settings, all in one place so i can change them easily
const settings = {
  oilLevel: 0.69, // the oil starts at 69% of the screen height (from the picture)

  gravity: 0.45,
  jumpPower: -8,
  maxFall: 10,

  sambosaX: 0.15, // 15% from the left
  sambosaSize: 80,

  fireWidth: 90,
  gapSize: 200, // space between top and bottom fire
  fireSpacing: 380, // distance between each pair

  startSpeed: 3.5,
  winScore: 15,
}

const messages = {
  win: 'You Win! 🎉',
  lose: 'Game Over',
}

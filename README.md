# GA Sambosa

![GA Sambosa gameplay: a small sambosa jumping between columns of fire above a pan of hot oil](screenshot.png)

**GA Sambosa** is a side-scrolling browser game. A sambosa is trying to escape a hot frying pan. It keeps falling because of gravity, so you jump to pass through the gaps in the fire. Do not touch the fire and do not fall into the oil! The BIBF building is in the background, and the background changes as your score grows.

- Score **20 points** (one for every fire you pass) to win.
- Mini sambosas make you grow. A big sambosa can take a hit from the fire and shrink instead of losing.
- The game speeds up as you score. Your best score is saved in your browser.
- Sound effects and a crackling fire sound can be turned off with the mute button (the choice is saved).

## Getting Started

- **Play the game:** https://hamedo0.github.io/ga-sambosa/
- **Planning materials:**
  - [Project board](https://github.com/users/hamedo0/projects/2?query=sort%3Aupdated-desc+state%3Aopen)
  - Wireframe:

    <img width="600" alt="Wireframe of the game" src="https://github.com/user-attachments/assets/c0b8dd8c-2cc6-4edc-966a-361cb107aecd" />

- **Sprint 1** (2026-11-17 to 2026-11-25): build a simple side-scrolling game where a sambosa that falls with gravity jumps through the fire, passes 20 fires to win, and avoids both the fire and the oil in the pan.

To run it on your computer, clone the repo and open `index.html` in a browser. No install is needed.

## How to Play

| Action | Keys |
| --- | --- |
| Jump | `Space`, `↑` (Up Arrow), or click / tap |
| Mute / unmute | The speaker button (bottom right). It works with the keyboard too: `Tab` to it and press `Enter` |
| Start / play again | The **Play** button, or `Space` after a game ends |

1. Fly through the gaps in the fire. Each fire you pass is **+1 point**.
2. Catch the mini sambosas to **grow**.
3. Touching the fire as a small sambosa, or falling into the oil, is **Game Over**. A big sambosa shrinks instead.
4. Reach **20 points** to win.

## Why I Chose This Game

I wanted a game that uses only the DOM (no canvas) and still needs real game logic: gravity, jumping, collisions, a score, a timer and win / lose screens. A side-scroller with one-button controls is easy to learn, so the fun comes from the details. I added a food twist: a sambosa escaping a frying pan, with the BIBF building in the background.

## Technologies Used

- HTML5 (semantic elements, ARIA labels for the mute button and the pictures)
- CSS3 (Flexbox, Grid, animations, `mix-blend-mode`, media queries, `prefers-reduced-motion`)
- JavaScript (vanilla, DOM manipulation, `localStorage`, `Audio`)
- Git and GitHub (version control, project board, GitHub Pages)

## File Structure

```
index.html      the page
css/style.css   all the styles
js/data.js      settings, backgrounds, messages and sounds
js/app.js       the game logic
images/         backgrounds, sambosa and fire video
sounds/         sound effects
```

## Attributions

- Background pictures (`images/bg1.jpg`, `bg2.jpg`, `bg3.jpg`) and the sambosa picture (`images/sambosa.png`): generated with an AI image tool. TODO: write the name of the AI tool here.
- Fire video (`images/fire.mp4`): TODO: write the source and the link of this video here.
- Sound effects (`sounds/*.mp3`): TODO: write where the sounds came from (and the license) here.

## Next Steps

- Add a difficulty choice (slower or faster fire, smaller gaps).
- Keep a top-5 high score list instead of one best score.
- Add more backgrounds and a "level up" message when the background changes.
- Add power-ups (for example a short shield) and different types of fire.
- Add touch-friendly controls and a pause button.

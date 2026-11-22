# Sambosa Escape

![Screenshot of Sambosa Escape](screenshot.png)

Sambosa Escape is a game I made for my first General Assembly project. You play a sambosa that is trying to escape a hot frying pan. The sambosa keeps falling down, so you have to jump to get through the gaps in the fire. If you touch the fire when you are small, or fall into the oil, you lose. The score goes up by 1 each time you pass a fire. Get 20 points to win.

The background changes as your score goes up, and the flames under the pan are moving. There are mini sambosas on the way. If you catch one, your sambosa gets bigger. A bigger sambosa can touch the fire once and just get smaller. The game also gets faster as you score. It saves your best score in the browser.

## Getting Started

- Play the game here: https://hamedo0.github.io/ga-sambosa/
- Project board: https://github.com/users/hamedo0/projects/2?query=sort%3Aupdated-desc+state%3Aopen
- Sprint 1 plan: 2026-11-17 to 2026-11-25. The goal was a simple side scrolling game where the sambosa falls with gravity and jumps through the fire without touching the fire or the oil.
- My wireframe:

  <img width="600" alt="Wireframe of the game" src="https://github.com/user-attachments/assets/c0b8dd8c-2cc6-4edc-966a-361cb107aecd" />

To run it on your computer, download or clone the repo and open `index.html` in a browser.

## How to Play

- Jump with the Space key, the Up Arrow key, or a click.
- Fly through the gaps in the fire to get points.
- Catch the mini sambosas to get bigger.
- Touching the fire when you are small, or falling into the oil, is Game Over.
- Get 20 points to win.
- Use the speaker button at the bottom right to turn the sound off. With the keyboard, press Tab to get to it and then Enter.

## Why I Chose This Game

I wanted to make a game like Flappy Bird, but with my own idea. Our tutor loves sambosa, so I made the player a sambosa escaping from a frying pan. The background is BIBF, where we study. I also wanted to practice the DOM, timers (setInterval), and events.

## Technologies Used

- HTML
- CSS
- JavaScript
- Git
- GitHub
- GitHub Pages

## File Structure

```
index.html      the page
css/style.css   the styles
js/data.js      the settings, backgrounds, messages and sounds
js/app.js       the game code
images/         backgrounds, sambosa and the fire video
sounds/         sound effects
```

## Attributions

- Images (the 3 backgrounds and the sambosa): made with an AI image tool. Tool name: I will add it.
- Fire video (`images/fire.mp4`): source: I will add it.
- Sound effects: made with Claude (AI).

## Challenges

- Making the hit box feel fair. The sambosa picture has empty space around it, so I made the hit box smaller.
- Keeping the sambosa small at the start and letting it grow when it eats a mini sambosa.
- Getting the flames to sit on the burner at any window size.

## Next Steps

- Add an easy and a hard mode.
- Save a top 5 scores list, not just the best score.
- Add more backgrounds.
- Add a pause button.

# The Last Shift

A first-person, browser-based 3D horror game set inside the abandoned Blackwater Textile Works. Find four breaker fuses, restore power to the exit, and survive the thing stalking the factory.

## Run locally

Requires Node.js 18 or newer.

```sh
npm install
npm start
```

Open http://localhost:3000. Click **Enter the Factory** to begin. Controls: **WASD** to move, **mouse** to look, **Shift** to run, **E** to interact. Press **Esc** to pause. Headphones recommended.

The game uses Three.js and WebGL for its procedural 3D environment. The included Node server serves the game and provides `/api/status` plus a lightweight `/api/scores` endpoint; scores are stored locally in `data/scores.json` (ignored by Git). Three.js and the display fonts are loaded from public CDNs, so an internet connection is required.

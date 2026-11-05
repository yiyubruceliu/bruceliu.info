# Get to 30 seconds

A one-button timing game. Hold to run the clock, release as close to **30.000** as you can. Letting go adds **0.5s** to your time. Hit exactly `30.000` and you get confetti.

## Run

Browsers can’t write `scores.json` on their own, so use the local server:

```bash
python server.py
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

## Play

1. Enter your name (saved in `localStorage` for later visits).
2. Hold the red stem (any mouse button) or any key.
3. Release near `30.000`.
4. Your best score (closest to target) lands on the leaderboard.

## Files

| File | Role |
| --- | --- |
| `index.html` | Bundled game (HTML + CSS + JS) |
| `server.py` | Serves the page and writes scores |
| `scores.json` | Leaderboard data |
| `fonts/` | Self-hosted display/UI fonts |

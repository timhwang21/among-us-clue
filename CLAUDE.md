# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Serve locally (required — file:// blocks ES modules)
npm run serve            # starts python3 -m http.server 8765 and opens browser
python3 -m http.server 8765 --directory .   # manual equivalent

# Unit tests (vitest, no browser needed)
npm test                 # run all unit tests
npx vitest run test/game.test.js   # single test file

# E2e tests (Playwright, requires server running on :8765)
npm run test:e2e         # full suite
npx playwright test --grep "no console errors"   # smoke test used by the PostToolUse hook
```

The PostToolUse hook in `.claude/settings.local.json` runs the smoke test automatically after edits to `index.html` or `src/*.js`. If it exits non-zero, there's a JS error or `startGame` is not defined.

## Architecture

This is a **single-file browser game** with no build step. Everything is served as plain files.

```
index.html          — all CSS, HTML structure, and ~700 lines of UI JavaScript
src/
  data.js           — static game data: SUSPECTS, EXTRAS, ROOMS, WEAPONS, and all TMPL clue templates
  game.js           — pure game logic: buildTrustStructure(), buildClues(), buildExtraHints(), createGame()
  utils.js          — rand(arr), shuffle(arr)
test/
  game.test.js      — vitest unit tests for game logic
  utils.test.js     — vitest unit tests for utils
  e2e/game.spec.js  — Playwright e2e tests
scripts/smoke.sh    — PostToolUse hook script
```

### Critical constraint: `window` exposure

`index.html` uses `onclick="startGame()"` etc. on HTML elements. Since the game script runs as `<script type="module">`, all handler functions must be explicitly exported to `window`:

```js
Object.assign(window, { startGame, submitAccusation, getExtraHint, cycleMark, cycleClue, showScreen, downloadLog });
```

**Forgetting this causes the most common regression**: `startGame is not defined`.

### Game logic flow

`createGame()` in `src/game.js` → `buildTrustStructure()` picks one of three patterns → `buildClues()` assembles core + red-herring clues → `buildExtraHints()` builds the progressive hint stack.

The trust structures (randomly chosen per game) determine solvability — see `DESIGN.md` for the full design rationale. Key invariant: **the killer never appears as a voucher**. This means any suspect who vouches for someone is provably innocent.

State lives in `index.html` globals: `answer`, `clues`, `clueMarks`, `clueRevealIdx`, `extraHints`, `marks`, `connections` (for drag-drawn lines), `_drag`.

### Canvas lines overlay

`#lines-canvas` is a `position:fixed; z-index:999; pointer-events:none` canvas that draws bezier connections between board nodes. It must be redrawn on every state change that affects node positions (`renderBoard`, `showScreen`, `resize`). The drag system attaches `mousedown` listeners via event delegation on the three list containers (not individual nodes) so they survive `innerHTML` re-renders.

### Screens

Three screens toggled by `showScreen(name)`: `title`, `game`, `result`. The title animation (`startTitleAnimation`) runs a continuous `requestAnimationFrame` loop — it's stopped when leaving the title screen.

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
index.html          — all CSS, HTML, and UI JavaScript (~1350 lines)
src/
  data.js           — SUSPECTS, EXTRAS, ROOMS, WEAPONS, TMPL templates, SILLY_LINES, PERSONALITY_LINES
  facts.js          — abstract fact schema: vouch(), witness(), roomCorr(), etc.
  game.js           — createGame() orchestrator: picks strategy, calls solver, assembles clues
  render.js         — factToClue() + buildNoise() (flavor/personality clues)
  solver.js         — inference engine: solve(), verify() (solvability + minimality)
  utils.js          — rand(arr), shuffle(arr)
  strategies/
    index.js        — STRATEGIES registry + pickStrategy()
    twoPairs.js     — (+ chain, star, cycle, fork, loneWolf, yConverging, twoShortChains, negation)
test/
  game.test.js      — vitest unit tests for game logic and invariants
  solver.test.js    — solver unit tests
  utils.test.js     — utils unit tests
  e2e/game.spec.js  — Playwright e2e tests
scripts/smoke.sh    — PostToolUse hook script
```

### Critical constraint: `window` exposure

`index.html` uses `onclick="startGame()"` etc. on HTML elements. Since the game script runs as `<script type="module">`, all handler functions must be explicitly exported to `window`:

```js
Object.assign(window, { startGame, submitAccusation, getExtraHint, cycleMark, cycleClue, showScreen, downloadLog, openHistoryDialog, replayGame, downloadGame, clearHistory });
```

**Forgetting this causes the most common regression**: `startGame is not defined`.

### Game logic flow

`createGame()` in `src/game.js` → `buildClues()` picks a strategy from `src/strategies/` → assembles deductive facts → `buildNoise()` in `src/render.js` adds flavor clues → `buildExtraHints()` builds the progressive hint stack. Every game is validated by `src/solver.js` for solvability, uniqueness, and minimality before returning.

`createGame()` returns: `{ answer, victim, silly, clues, extraHints, trustChain, personalities }`.
- `trustChain`: `{ innocents: Suspect[], killerFakeRoom: Room, structure: string }` — the deductive skeleton
- `personalities`: `{ [suspectName]: 'silly'|'hysterical'|'peacemaker'|'salty'|'overconfident' }` — cosmetic only

State lives in `index.html` globals: `answer`, `victim`, `silly`, `clues`, `clueMarks`, `clueRevealIdx`, `extraHints`, `extraHintIdx`, `marks`, `personalities`, `trustChain`, `connections` (for drag-drawn lines), `_drag`, `killRisk`.

### Clue object shape

Every clue (in `clues[]` and `extraHints[]`) has this shape:
```js
{
  speaker: Suspect,        // full object from SUSPECTS/EXTRAS
  text: string,
  accusation?: boolean,    // shows angry icon
  dead?: boolean,          // ghost speaker (victim only)
  deductive: boolean,      // true = from deductive core (🔍 badge); false = flavor/noise
  personality?: string,    // only set on clues drawn from personality-specific pools
}
```
`personality` is set **per clue**, not per speaker — only clues drawn from `SILLY_LINES` or `PERSONALITY_LINES.*` carry it. A speaker with a personality can have both tagged and untagged clues.

### Strategies

Nine trust structures in `src/strategies/`: `twoPairs`, `chain`, `star`, `cycle`, `fork`, `loneWolf`, `yConverging`, `twoShortChains`, `negation`. Each exports a `build(innocents, rooms)` function returning `{ edges, killerFakeRoom }`. The registry is `src/strategies/index.js`.

### Game log / history

`saveGame(outcome?)` writes to `localStorage.gameLog` (array of entries). Called on game start with no outcome, then again on win/loss/killed to update outcome. The entry stores all names as strings; `replayGame(id)` reconstructs full objects by name from `SUSPECTS`/`EXTRAS`/`ROOMS`/`WEAPONS`. `openHistoryDialog()`, `replayGame()`, `downloadGame()`, `clearHistory()` are all window-exposed.

### Canvas lines overlay

`#lines-canvas` is a `position:fixed; z-index:999; pointer-events:none` canvas that draws bezier connections between board nodes. It must be redrawn on every state change that affects node positions (`renderBoard`, `showScreen`, `resize`). The drag system attaches `mousedown` listeners via event delegation on the three list containers (not individual nodes) so they survive `innerHTML` re-renders.

### Screens

Three screens toggled by `showScreen(name)`: `title`, `game`, `result`. The title animation (`startTitleAnimation`) runs a continuous `requestAnimationFrame` loop — it's stopped when leaving the title screen.

## Changelog

The changelog lives in the `#changelog-dialog` section of `index.html` (around line 582). Update it whenever you implement player-facing features. Newest entry at the top; each entry is a `<div class="changelog-entry">` with a date and `<ul>` of bullets describing what the player experiences. Do not add entries for refactors, test changes, or internal architecture changes.

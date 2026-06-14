# Among Us: Clue

A browser-based deduction game that combines the social dynamics of **Among Us** with the logic of **Clue**. You're a crewmate trying to identify the impostor before they get you — but there's no voting, no social bluffing, just evidence.

## How to play

Each game generates a hidden answer: **one suspect**, **one room**, **one weapon**. The crew gives testimony — alibis, corroborations, accusations, and rumors — and you must use logic to narrow down the truth.

Evidence is revealed one clue at a time. Once you've deduced the answer, make your accusation. If you're wrong, you get ejected. If you wait too long and ask for extra hints, the impostor might strike first.

**The key insight**: crewmates never lie about who they saw where. If someone vouches for another, the voucher is innocent — and their testimony is honest. This cascades. Start from a voucher, follow the chain, and the impostor is whoever remains.

## Running locally

```bash
npm run serve      # starts server on :8765 and opens browser
npm test           # unit tests (vitest)
npm run test:e2e   # Playwright e2e tests (requires server on :8765)
```

## Project structure

```
index.html          — all CSS, HTML, and UI JavaScript
src/
  data.js           — static game data (suspects, rooms, weapons) and clue templates
  facts.js          — abstract fact schema: vouch(), witness(), roomCorr(), etc.
  solver.js         — inference engine + solvability/minimality verifier
  game.js           — createGame() orchestrator
  render.js         — facts → rendered clue text; noise clue builder
  utils.js          — rand(), shuffle()
  strategies/       — one file per trust structure (9 total)
test/
  game.test.js      — createGame() shape and invariant tests
  solver.test.js    — solver unit tests + property tests across 500 games
  e2e/game.spec.js  — Playwright end-to-end tests
```

---

## Design Philosophy

### Core goal: Sudoku-style process of elimination

The hint system is designed so every game is solvable through **deductive process of elimination** — not guessing, not probability, not "process of exclusion by absence." Every clue either confirms an innocent or implicates the killer, and the full clue set always contains enough information to identify all three answers definitively.

This mirrors Sudoku: you never need to guess. If the puzzle is valid, some chain of eliminations always resolves to the answer.

### Trust Axiom

The single rule that makes the system work:

> **Only innocent crewmates vouch for others.** The killer only lies about their own alibi. They do not vouch for innocents or provide corroborating testimony for other suspects.

This means: if you see someone vouching for another person, the voucher is innocent. And if the voucher is innocent, their testimony is honest — so the person they vouched for is also innocent. This cascades.

Two structural invariants that follow from this axiom (enforced in code by `solver.js`):
- **Killer never vouches**: `vouch.from ≠ killer`
- **Killer never vouched-for**: `vouch.to ≠ killer` — a truthful innocent vouching for the killer would falsely exonerate them and break solvability.

### Abstract Fact Schema

The solver and renderer work with abstract facts (no template text). Each fact is one of:

| Type | Fields | Meaning |
|------|--------|---------|
| `vouch` | `from`, `to`, `room` | `from` testifies `to` was in `room` |
| `killerLie` | `room` | killer's false alibi (decoration, not deductive) |
| `witness` | `speaker`, `kind`, `value` | innocent names killer/room/weapon directly |
| `roomCorr` | `speaker`, `room` | corroborates the murder room |
| `weaponHint` | `speaker`, `weapon` | murder weapon missing from storage |
| `weaponElim` | `weapon` | a non-murder weapon, ruled out |

Strategies emit `vouch` edges. The game orchestrator (`game.js`) adds closing facts (`roomCorr`, `weaponHint`, and for lone-wolf, a `witness`). All deductive facts are verified by `solver.js` before any clue text is rendered.

### Trust Structures

Nine trust structures are implemented, chosen randomly each game:

#### Two Mutual Pairs
```
A ↔ B  (A says B was in room X; B says A was in room X)
C ↔ D  (C says D was in room Y; D says C was in room Y)
```
**Deduction**: A vouches → A innocent → B innocent. C vouches → C innocent → D innocent. Four innocents → fifth is killer. The symmetric backing makes both pairs immediately recognizable. *(Difficulty: 1)*

#### Chain: A → B → C → D
```
A backs B → B backs C → C backs D
```
**Deduction**: A vouches → cascade to D → killer. Subtler than two-pairs: the player must start from A and follow the full chain. *(Difficulty: 2)*

#### Star: A backs B, C, and D independently
```
A backs B (room X), A backs C (room Y), A backs D (room Z)
```
**Deduction**: A vouches → A innocent → B, C, D all innocent → killer. Recognizable as "one hub witness." *(Difficulty: 2)*

#### Cycle: A → B → C → D → A
```
A backs B, B backs C, C backs D, D backs A
```
**Deduction**: Any single vouching node breaks the cycle open. Harder than chain: no obvious starting node. *(Difficulty: 2)*

#### Fork: A → B, A → C, D → B
```
A backs B and C; D also backs B (cross-corroboration)
```
**Deduction**: A vouches → A, B, C innocent. D vouches → D innocent. Four innocents → killer. *(Difficulty: 3)*

#### Lone-Wolf: A → B → C + direct witness
```
A backs B, B backs C
One proven innocent directly names the killer
```
**Deduction**: A→B→C proves three innocents. The witness is the *sole* path to killer identity — the only strategy with a direct sighting. *(Difficulty: 3)*

#### Y / Converging: A→C, B→C, C→D
```
A backs C, B backs C (independent corroboration), C backs D
```
**Deduction**: A→C and B→C converge; then C→D. Harder than chain: no obvious single starting chain. *(Difficulty: 3)*

#### Two Short Chains: A→B, C→D
```
A backs B (room X), C backs D (room Y)
```
**Deduction**: Two independent trust chains, no mutual backing. Subtler than two-pairs: without symmetric confirmation, each chain must be read independently. *(Difficulty: 2)*

#### Negation Testimony: A→B→C + denial
```
A backs B, B backs C (three-step trust chain)
One proven innocent: "[Killer] was NOT in [fakeRoom]"
```
**Deduction**: A→B→C proves three innocents. The denial contradicts the killer's claimed alibi — indirect contradiction rather than direct sighting. *(Difficulty: 3)*

### What Makes a Valid Clue Set

Every game is validated by `solver.js` before rendering. The verifier enforces:

1. **Vouch integrity**: killer never vouches; killer never vouched-for.
2. **Solvability**: inference-to-fixpoint derives the full answer `{ killer, room, weapon }`.
3. **Unique determination**: 5×8×6 = 240 enumerated candidates; exactly one is consistent.
4. **Minimality**: every deductive closing fact (witness, roomCorr, weaponHint, weaponElim) is load-bearing — removing any one makes the game unsolvable. Vouch edges (the strategy's structural signature) are exempt from this check.

### Red Herrings and Noise

Non-deductive flavor clues — exempt from the minimality check, ignored by the solver:

- **Hysterical accusations**: innocents who incorrectly accuse each other. Never accuse someone the speaker personally vouched for (visible internal contradiction).
- **Suspicious behavior reports**: "I noticed [person] acting weird." Adds paranoia without proof.
- **False weapon/room corroboration**: non-murder room or weapon, drawing attention away from the real scene.
- **Silly lines**: flavor text with no evidentiary value.
- **Guardian angel**: flavor text from the victim.

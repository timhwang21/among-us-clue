# Hint System Design

## Core Goal: Sudoku-style Process of Elimination

The hint system is designed so every game is solvable through **deductive process of elimination** — not guessing, not probability, not "process of exclusion by absence." Every clue either confirms an innocent or implicates the killer, and the full clue set always contains enough information to identify all three answers definitively.

This mirrors Sudoku: you never need to guess. If the puzzle is valid, some chain of eliminations always resolves to the answer.

## Trust Axiom

The single rule that makes the system work:

> **Only innocent crewmates vouch for others.** The killer only lies about their own alibi. They do not vouch for innocents or provide corroborating testimony for other suspects.

This means: if you see someone vouching for another person, the voucher is innocent. And if the voucher is innocent, their testimony is honest — so the person they vouched for is also innocent. This cascades.

Two structural invariants that follow from this axiom (enforced in code by `solver.js`):
- **Killer never vouches**: `vouch.from ≠ killer`
- **Killer never vouched-for**: `vouch.to ≠ killer` — a truthful innocent vouching for the killer would falsely exonerate them and break solvability.

## Abstract Fact Schema

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

## Trust Structures (all six implemented, chosen randomly each game)

### Two Mutual Pairs

```
A ↔ B  (A says B was in room X; B says A was in room X)
C ↔ D  (C says D was in room Y; D says C was in room Y)
Killer claims room Z (no one backs this)
```

**Deduction**: A vouches → A innocent → B innocent. C vouches → C innocent → D innocent. Four innocents → fifth is killer. The symmetric backing makes both pairs immediately recognizable.

### Chain: A → B → C → D

```
A backs B (A saw B in room X)
B backs C (B saw C in room Y)
C backs D (C saw D in room Z)
```

**Deduction**: A vouches → A innocent → B innocent → C innocent → D innocent → killer. Subtler than two-pairs: the player must start from A (the first voucher) and cascade.

### Star: A backs B, C, and D independently

```
A backs B (saw B in room X)
A backs C (saw C in room Y)
A backs D (saw D in room Z)
```

**Deduction**: A vouches → A innocent. A honest → B, C, D all innocent → killer. Recognizable as "one hub witness who confirmed everyone else."

### Cycle: A → B → C → D → A

```
A backs B, B backs C, C backs D, D backs A
```

**Deduction**: Any single vouching node breaks the cycle open. A vouches → A innocent → B innocent → C innocent → D innocent → A innocent (already). Harder than chain because there's no obvious "starting node."

### Fork: A → B, A → C, D → B (cross-corroboration)

```
A backs B and C; D also backs B
```

**Deduction**: A vouches → A innocent → B, C innocent. D vouches → D innocent. Four innocents → killer. Cross-corroboration on B adds a second trust signal; D's innocence follows from being a voucher.

### Lone-Wolf: A → B → C + direct witness

```
A backs B (saw B in room X)
B backs C (saw C in room Y)
One proven innocent directly names the killer
```

**Deduction**: A→B→C proves three innocents. The witness fact (an innocent directly naming the killer) is the *sole* path to killer identity — not a duplicate of the trust chain. This is the only strategy where a direct witness appears; for all other strategies the trust chain alone closes all four innocents.

## What Makes a Valid Clue Set

Every game is validated by `solver.js` before rendering. The verifier enforces:

1. **Vouch integrity**: killer never vouches; killer never vouched-for.
2. **Solvability**: inference-to-fixpoint derives the full answer `{ killer, room, weapon }`.
3. **Unique determination**: 5×8×6 = 240 enumerated candidates; exactly one is consistent.
4. **Minimality**: every deductive closing fact (witness, roomCorr, weaponHint, weaponElim) is load-bearing — removing any one makes the game unsolvable. Vouch edges (the strategy's structural signature) are exempt from this check.

## Red Herrings and Noise

Non-deductive flavor clues — exempt from the minimality check, ignored by the solver:

- **Hysterical accusations**: innocents who incorrectly accuse each other. Never accuse someone the speaker personally vouched for (visible internal contradiction).
- **Suspicious behavior reports**: "I noticed [person] acting weird." Adds paranoia without proof.
- **False weapon/room corroboration**: non-murder room or non-murder weapon, drawing attention away from the real scene.
- **Silly lines**: flavor text with no evidentiary value.
- **Guardian angel**: flavor text from the victim.

### Y / Converging: A→C, B→C, C→D

```
A backs C (saw C in room X)
B backs C (saw C in room X, independent corroboration)
C backs D (saw D in room Y)
```

**Deduction**: A vouches → A innocent → C innocent. B vouches → B innocent → C innocent (already). C innocent → D innocent. Four innocents → killer. Harder than chain: neither A nor B starts an obvious single chain; the player must recognize two paths converging on C.

### Two Short Chains: A→B, C→D

```
A backs B (saw B in room X)
C backs D (saw D in room Y)
```

**Deduction**: A vouches → A innocent → B innocent. C vouches → C innocent → D innocent. Four innocents → killer. Subtler than two-pairs: the lack of symmetric backing means each chain must be read independently without the mutual confirmation that makes two-pairs legible.

### Negation Testimony: A→B→C + denial

```
A backs B, B backs C (three-step trust chain)
One proven innocent: "[Killer] was NOT in [fakeRoom]"
```

**Deduction**: A→B→C proves three innocents. The denial clue contradicts the killer's claimed alibi — the player must connect "who denied the alibi" (an honest proven innocent) with "who claimed it" (the killer). Different from lone-wolf: the evidence is an indirect contradiction, not a direct sighting.

## Difficulty Tiers

Each strategy carries a `difficulty` field (1–3) used by `pickStrategy()` for potential difficulty-filtered selection:

- **1 — Easy**: Two Mutual Pairs (symmetric, immediately legible)
- **2 — Medium**: Chain, Star, Cycle, Two Short Chains (require cascading or pattern recognition)
- **3 — Hard**: Fork, Lone-Wolf, Y-Converging, Negation-Testimony (cross-corroboration, isolated witness, or indirect contradiction)

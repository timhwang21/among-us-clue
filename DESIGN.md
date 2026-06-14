# Hint System Design

## Core Goal: Sudoku-style Process of Elimination

The hint system is designed so every game is solvable through **deductive process of elimination** — not guessing, not probability, not "process of exclusion by absence." Every clue either confirms an innocent or implicates the killer, and the full clue set always contains enough information to identify all three answers definitively.

This mirrors Sudoku: you never need to guess. If the puzzle is valid, some chain of eliminations always resolves to the answer.

## Trust Axiom

The single rule that makes the system work:

> **Only innocent crewmates vouch for others.** The killer only lies about their own alibi. They do not vouch for innocents or provide corroborating testimony for other suspects.

This means: if you see someone vouching for another person, the voucher is innocent. And if the voucher is innocent, their testimony is honest — so the person they vouched for is also innocent. This cascades.

## Trust Structures (all three implemented, chosen randomly each game)

### Two Mutual Pairs

```
A ↔ B  (A says B was in room X; B says A was in room X)
C ↔ D  (C says D was in room Y; D says C was in room Y)
Killer claims room Z (no one backs this)
```

**Deduction**: A and B vouch for each other → both must be innocent (if A were the killer, innocent B has no reason to lie; if B were the killer, innocent A has no reason to lie). Same for C and D. Four innocents confirmed → fifth suspect is the killer.

### Chain: A → B → C → D

```
A backs B (A saw B in room X)
B backs C (B saw C in room Y)
C backs D (C saw D in room Z)
```

**Deduction**: A vouches for someone → A is innocent (killer doesn't vouch for others). A innocent → A's testimony is honest → B innocent. B innocent → B's testimony honest → C innocent. C innocent → D innocent. Four innocents → fifth is killer.

The chain is subtly harder: the player must recognize that "vouching = innocent" and cascade the trust rather than finding symmetric pairs.

### Star: A backs B, C, and D independently

```
A backs B (saw B in room X)
A backs C (saw C in room Y)
A backs D (saw D in room Z)
```

**Deduction**: A vouches for three people → A is innocent. A innocent + honest → B, C, D all innocent. Four innocents → killer.

The star is recognizable as "one witness who saw everyone." Players can question whether A could be lying about all three, but the trust axiom rules this out.

### Other structures to explore

- **Cycle**: A→B→C→D→A (everyone vouches for the next). Any single vouching node proves the whole cycle innocent.
- **Fork**: A→B, A→C, D→B (D and A both confirm B). Cross-corroboration.

## Second Deductive Path: Direct Witness Clues

Separate from the trust structure, individual clues can directly implicate the killer:

**Weapon witness**: `"I saw [killer] carrying the [murder weapon] before the alarm."`
Combined with the weapon-missing clue (`"The [weapon] was gone from storage"`), this names the killer and the weapon.

**Room witness**: `"I saw [killer] leaving [murder room] in a hurry right before the alarm."`
Combined with the crime-scene corroboration clue (`"There was a commotion near [room]"`), this names the killer and the room.

These clues provide an independent path to the answer that doesn't require following the trust chain. A player can solve the game using only the witness path, only the trust-chain path, or both converging on the same answer — like Sudoku where multiple constraint types interact.

## What Makes a Valid Clue Set

Every game must satisfy:
1. **Completeness**: The trust chain alone identifies all 4 innocents, leaving only the killer.
2. **Consistency**: All clues point to the same killer/room/weapon.
3. **Decoy validity**: Red-herring clues (hysterical accusations, false behavior reports) never contradict the true answer — they only mislead, they don't actively lie about the confirmed answers.
4. **Vouch integrity**: The killer never appears as a voucher in any trust chain clue.

## Red Herrings and Noise

Not every clue is load-bearing. The game deliberately includes:

- **Hysterical accusations**: Innocents who incorrectly accuse each other ("It was [person]!! I KNOW it was [person]!!"). These are emotionally charged and vague — no factual claim about room/weapon. They should never accuse someone the speaker has vouched for (that would be an obvious internal contradiction).
- **Suspicious behavior reports**: "I noticed [person] acting weird." Could apply to anyone; adds paranoia without proof.
- **False weapon/room corroboration**: Clues that mention a non-murder room or non-murder weapon, drawing attention away from the real scene.

The player's job is to distinguish noise from signal — the same skill as in Sudoku, where not every empty cell is the next to fill.

import { TYPE } from './facts.js';
import { SUSPECTS, ROOMS, WEAPONS } from './data.js';

// Run the player's deduction rules to a fixpoint over the given facts.
// Returns { innocents: Set<name>, killer, room, weapon, firedFacts: Set<fact> }.
function solve(facts) {
  const innocents   = new Set();
  const firedFacts  = new Set();
  let   killedBy    = null;
  let   crimeRoom   = null;
  let   crimeWeapon = null;
  const elimWeapons = new Set();

  let changed = true;
  while (changed) {
    changed = false;

    for (const f of facts) {
      if (firedFacts.has(f)) continue;

      if (f.type === TYPE.VOUCH) {
        // Any voucher is innocent (killer never vouches).
        let fired = false;
        if (!innocents.has(f.from.name)) { innocents.add(f.from.name); fired = true; }
        // If the voucher is innocent their testimony is honest → target is innocent.
        if (innocents.has(f.from.name) && !innocents.has(f.to.name)) {
          innocents.add(f.to.name); fired = true;
        }
        if (fired) { firedFacts.add(f); changed = true; }
      }

      if (f.type === TYPE.WITNESS) {
        // An innocent witness directly names the killer / room / weapon.
        if (!innocents.has(f.speaker.name)) continue;
        if (f.kind === 'suspect' && !killedBy)    { killedBy    = f.value.name; firedFacts.add(f); changed = true; }
        if (f.kind === 'room'    && !crimeRoom)    { crimeRoom   = f.value.name; firedFacts.add(f); changed = true; }
        if (f.kind === 'weapon'  && !crimeWeapon)  { crimeWeapon = f.value.name; firedFacts.add(f); changed = true; }
      }

      if (f.type === TYPE.NEGATION) {
        // An innocent's denial of the killer's fake alibi identifies the killer.
        if (!innocents.has(f.speaker.name)) continue;
        if (!killedBy) { killedBy = f.killer.name; firedFacts.add(f); changed = true; }
      }

      if (f.type === TYPE.ROOM_CORR && !crimeRoom) {
        // Only trust the room corroboration once its speaker is proven innocent (same gate as
        // WITNESS/NEGATION/WEAPON_ELIM) — the killer could falsely corroborate a wrong room.
        if (f.speaker && !innocents.has(f.speaker.name)) continue;
        crimeRoom = f.room.name; firedFacts.add(f); changed = true;
      }

      if (f.type === TYPE.WEAPON_HINT && !crimeWeapon) {
        crimeWeapon = f.weapon.name; firedFacts.add(f); changed = true;
      }

      if (f.type === TYPE.WEAPON_ELIM) {
        // Only fires once the speaker is proven innocent (same deductive gate as WITNESS/NEGATION).
        if (f.speaker && !innocents.has(f.speaker.name)) continue;
        if (!elimWeapons.has(f.weapon.name)) { elimWeapons.add(f.weapon.name); firedFacts.add(f); changed = true; }
      }
    }

    // Elimination: 4 confirmed innocents → 5th must be killer.
    if (innocents.size >= 4 && !killedBy) {
      const remaining = SUSPECTS.filter(s => !innocents.has(s.name));
      if (remaining.length === 1) { killedBy = remaining[0].name; changed = true; }
    }

    // Reverse elimination: killer known → all other suspects are innocent.
    if (killedBy && innocents.size < SUSPECTS.length - 1) {
      for (const s of SUSPECTS) {
        if (s.name !== killedBy && !innocents.has(s.name)) {
          innocents.add(s.name); changed = true;
        }
      }
    }

    // Weapon elimination: only one weapon not in elimWeapons → that's the murder weapon.
    if (!crimeWeapon && WEAPONS.length - elimWeapons.size === 1) {
      const remaining = WEAPONS.filter(w => !elimWeapons.has(w.name));
      if (remaining.length === 1) { crimeWeapon = remaining[0].name; changed = true; }
    }
  }

  return { innocents, killer: killedBy, room: crimeRoom, weapon: crimeWeapon, firedFacts };
}

// Returns true iff the full answer { suspect, room, weapon } is derivable from facts.
function isSolvable(facts, answer) {
  const r = solve(facts);
  return (
    r.killer  === answer.suspect.name &&
    r.room    === answer.room.name    &&
    r.weapon  === answer.weapon.name
  );
}

// Enumeration cross-check: count candidate answers consistent with all facts.
// A consistent candidate is one that doesn't contradict any fact (as a truthfulness check).
// Returns the count — should be exactly 1 for a well-formed puzzle.
function countConsistentCandidates(facts) {
  let count = 0;
  for (const suspect of SUSPECTS) {
    for (const room of ROOMS) {
      for (const weapon of WEAPONS) {
        const candidate = { suspect, room, weapon };
        if (candidateConsistent(facts, candidate)) count++;
      }
    }
  }
  return count;
}

function candidateConsistent(facts, { suspect, room, weapon }) {
  // Compute provably-innocent suspects from the vouch chain.
  const provenInnocent = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of facts) {
      if (f.type !== TYPE.VOUCH) continue;
      if (!provenInnocent.has(f.from.name)) { provenInnocent.add(f.from.name); changed = true; }
      if (provenInnocent.has(f.from.name) && !provenInnocent.has(f.to.name)) {
        provenInnocent.add(f.to.name); changed = true;
      }
    }
  }
  // Killer cannot be provably innocent via the trust chain.
  if (provenInnocent.has(suspect.name)) return false;

  for (const f of facts) {
    if (f.type === TYPE.KILLER_LIE) {
      if (f.room.name === room.name) return false;
    }
    if (f.type === TYPE.WEAPON_ELIM) {
      if (f.speaker && !provenInnocent.has(f.speaker.name)) continue;
      if (f.weapon.name === weapon.name) return false;
    }
    if (f.type === TYPE.WITNESS) {
      if (f.speaker.name === suspect.name) return false; // witness must be innocent
      if (f.kind === 'suspect' && f.value.name !== suspect.name) return false;
      if (f.kind === 'room'    && f.value.name !== room.name)    return false;
      if (f.kind === 'weapon'  && f.value.name !== weapon.name)  return false;
    }
    if (f.type === TYPE.NEGATION) {
      if (f.speaker.name === suspect.name) return false; // speaker must be innocent
      if (f.killer.name !== suspect.name) return false;  // names a specific killer
    }
    if (f.type === TYPE.ROOM_CORR) {
      if (f.speaker && !provenInnocent.has(f.speaker.name)) continue;
      if (f.room.name !== room.name) return false;
    }
    if (f.type === TYPE.WEAPON_HINT && f.weapon.name !== weapon.name) return false;
  }
  return true;
}

// Minimality check for closing facts (witness, roomCorr, weaponHint, weaponElim).
// Vouch edges and NEGATION are exempt: vouch edges are intentionally redundant in some strategy
// patterns, and negation is always included as a structural alibi-debunk even when redundant
// for elimination strategies.
function isMinimal(facts, answer) {
  const closingTypes = new Set([TYPE.WITNESS, TYPE.ROOM_CORR, TYPE.WEAPON_HINT, TYPE.WEAPON_ELIM]);
  for (const f of facts) {
    if (!closingTypes.has(f.type)) continue;
    const without = facts.filter(x => x !== f);
    if (isSolvable(without, answer)) return false;
  }
  return true;
}

// Structural invariants: killer never vouches, killer never vouched-for.
function checkVouchIntegrity(facts, answer) {
  for (const f of facts) {
    if (f.type !== TYPE.VOUCH) continue;
    if (f.from.name === answer.suspect.name) return false; // killer is a voucher
    if (f.to.name   === answer.suspect.name) return false; // killer is vouched-for
  }
  return true;
}

// Main entry: returns null on success, or an error string on failure.
export function verify(facts, answer) {
  if (!checkVouchIntegrity(facts, answer))    return 'vouch integrity violation';
  if (!isSolvable(facts, answer))             return 'not solvable';
  if (countConsistentCandidates(facts) !== 1) return 'not uniquely determined';
  if (!isMinimal(facts, answer))              return 'redundant facts';
  return null;
}

export { solve, isSolvable, isMinimal, countConsistentCandidates };

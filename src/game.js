import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, TMPL, INVESTIGATION } from './data.js';
import { rand, shuffle, deconflictConsecutive } from './utils.js';
import { vouch, witness, negation, roomCorr, weaponElim } from './facts.js';
import { pickStrategy } from './strategies/index.js';
import { factToClue, buildNoise } from './render.js';
import { verify } from './solver.js';

const MAX_TRIES = 50;
const PERSONALITY_TYPES = ['silly', 'hysterical', 'peacemaker', 'salty', 'overconfident'];

// Assign one personality per crewmate. Each type may appear 0, 1, or 2 times;
// any crewmates beyond the assigned pool get null (no personality flavor).
function assignPersonalities(crewmates) {
  // Build a pool with two slots per type, then shuffle and deal.
  const pool = shuffle([...PERSONALITY_TYPES, ...PERSONALITY_TYPES]);
  return Object.fromEntries(crewmates.map((c, i) => [c.name, pool[i] || null]));
}

export function buildClues(answer, victim, personalities) {
  const innocents = shuffle(SUSPECTS.filter(s => s.name !== answer.suspect.name));
  const nonMurderRooms   = ROOMS.filter(r => r.name !== answer.room.name);
  const nonMurderWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const shuffledNMR      = shuffle(nonMurderRooms.slice());
  // Decided once per game — strategies that require negation always get it regardless.
  const wantNegation = Math.random() < 0.25;

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    const strategy = pickStrategy();
    const rooms    = shuffle(shuffledNMR.slice());
    const result   = strategy.build(innocents, rooms);
    const { edges, killerFakeRoom } = result;

    // Determine proven innocents from the vouch edges (to pick speakers for corroboration).
    const provenInnocents = getProvenInnocents(edges, innocents);

    // Assign non-murder weapons to proven innocents (cyclic; some innocents get 2).
    const shuffledNMW = shuffle(nonMurderWeapons.slice());
    const weaponAssignments = new Map(provenInnocents.map(p => [p.name, []]));
    shuffledNMW.forEach((w, i) =>
      weaponAssignments.get(provenInnocents[i % provenInnocents.length].name).push(w)
    );

    // Build the minimal deductive fact set.
    const [corrSpeaker] = shuffle(provenInnocents.slice());
    const coreFacts = [...edges];

    if (strategy.id === 'lone-wolf') {
      // Trust chain proves only 3 innocents (A→B→C). A witness from the proven set
      // names the killer directly — this is the SOLE path to killer identification.
      const witnessSpeaker = rand(provenInnocents);
      coreFacts.push(witness(witnessSpeaker, 'suspect', answer.suspect));
    }

    // Negation: a proven innocent contradicts the killer's fake alibi. Only included in ~25% of
    // games (for variety); strategies that can't be solved without it always get it. Excluded for
    // lone-wolf — its witness already names the killer, so a negation would make the witness
    // redundant and fail the minimality check (silently dropping all lone-wolf games).
    const includeNegation = (wantNegation && strategy.id !== 'lone-wolf') || strategy.requiresNegation;
    let negationSpeaker = null;
    let negSpeakerRoom  = null;
    if (includeNegation) {
      // Prefer innocents with a known room (vouch target) so the killer can counter-deny.
      const vouchedInnocents = provenInnocents.filter(p => edges.some(e => e.to.name === p.name));
      negationSpeaker = rand(vouchedInnocents.length ? vouchedInnocents : provenInnocents);
      negSpeakerRoom  = edges.find(e => e.to.name === negationSpeaker.name)?.room;
      coreFacts.push(negation(negationSpeaker, answer.suspect, killerFakeRoom));
    }

    coreFacts.push(roomCorr(corrSpeaker, answer.room));

    // Each proven innocent accounts for their assigned weapons; murder weapon identified by elimination.
    for (const [innocentName, weapons] of weaponAssignments) {
      const innocent = provenInnocents.find(p => p.name === innocentName);
      for (const w of weapons) coreFacts.push(weaponElim(innocent, w));
    }

    const err = verify(coreFacts, answer);
    if (err) continue;

    // Render deductive facts into clues.
    const deductiveClues = coreFacts.flatMap(f => factToClue(f, answer));

    // Killer's false alibi + deflect. If the negation speaker's room is known, the killer also
    // counter-denies that innocent's alibi — forcing players to resolve the 2v1 corroboration.
    const decorative = [
      { speaker: answer.suspect, text: rand(TMPL.killerLie)(killerFakeRoom.name), deductive: false },
      { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand(innocents).name), accusation: true, deductive: false },
    ];
    if (negSpeakerRoom) {
      decorative.push({
        speaker: answer.suspect,
        text: rand(TMPL.killerDenyRoom)(negationSpeaker.name, negSpeakerRoom.name),
        accusation: true,
        deductive: false,
      });
    }

    const noiseClues = buildNoise({ innocents, answer, victim, nonMurderRooms, personalities });

    const clues = deconflictConsecutive(shuffle([...deductiveClues, ...decorative, ...noiseClues]), c => c.speaker.name);
    const trustChain = { innocents, killerFakeRoom, structure: strategy.id };
    return { clues, trustChain };
  }

  throw new Error('Could not generate a valid game after ' + MAX_TRIES + ' tries');
}

export function buildExtraHints(answer, trustChain, victim) {
  const { killerFakeRoom } = trustChain;
  const hints = [];

  hints.push({ speaker: null, text: rand(INVESTIGATION.suspectBehavior)(answer.suspect.name) });

  hints.push({ speaker: null, text: rand(INVESTIGATION.bodyLocation)(answer.room.name) });
  hints.push({ speaker: null, text: rand(INVESTIGATION.suspectBehavior)(answer.suspect.name) });
  hints.push({ speaker: null, text: rand(INVESTIGATION.alibiContradiction)(answer.suspect.name, killerFakeRoom.name) });
  hints.push({ speaker: null, text: rand(INVESTIGATION.suspectBehavior)(answer.suspect.name) });

  const revealRoom = Math.random() < 0.5;
  hints.push({
    speaker: null,
    text: revealRoom
      ? rand(INVESTIGATION.victimJournalRoom)(victim.name, answer.room.name)
      : rand(INVESTIGATION.victimJournalWeapon)(victim.name, answer.weapon.name),
  });

  return hints;
}

export function createGame() {
  const answer = { suspect: rand(SUSPECTS), room: rand(ROOMS), weapon: rand(WEAPONS) };
  const victim = rand(EXTRAS);
  const personalities = assignPersonalities(SUSPECTS);
  personalities[victim.name] = 'dead';
  const { clues, trustChain } = buildClues(answer, victim, personalities);
  const extraHints = buildExtraHints(answer, trustChain, victim);
  return { answer, victim, clues, extraHints, trustChain, personalities };
}

// Derive which innocents are provably innocent from the vouch edges alone (trust-axiom cascade).
function getProvenInnocents(edges, allInnocents) {
  const innocent = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of edges) {
      if (!innocent.has(e.from.name)) { innocent.add(e.from.name); changed = true; }
      if (innocent.has(e.from.name) && !innocent.has(e.to.name)) {
        innocent.add(e.to.name); changed = true;
      }
    }
  }
  return allInnocents.filter(s => innocent.has(s.name));
}

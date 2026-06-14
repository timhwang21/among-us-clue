import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, TMPL, INVESTIGATION } from './data.js';
import { rand, shuffle, deconflictConsecutive } from './utils.js';
import { vouch, witness, negation, roomCorr, weaponHint } from './facts.js';
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

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    const strategy = pickStrategy();
    const rooms    = shuffle(shuffledNMR.slice());
    const result   = strategy.build(innocents, rooms);
    const { edges, killerFakeRoom } = result;

    // Determine proven innocents from the vouch edges (to pick speakers for corroboration).
    const provenInnocents = getProvenInnocents(edges, innocents);

    // Build the minimal deductive fact set.
    const [corrSpeaker, hintSpeaker] = shuffle(provenInnocents.slice());
    const coreFacts = [...edges];

    if (strategy.id === 'lone-wolf') {
      // Trust chain proves only 3 innocents (A→B→C). A witness from the proven set
      // names the killer directly — this is the SOLE path to killer identification.
      const witnessSpeaker = rand(provenInnocents);
      coreFacts.push(witness(witnessSpeaker, 'suspect', answer.suspect));
    }

    if (strategy.requiresNegation) {
      // Negation-testimony: a proven innocent contradicts the killer's fake alibi.
      const negationSpeaker = rand(provenInnocents);
      coreFacts.push(negation(negationSpeaker, answer.suspect, result.killerFakeRoom));
    }

    coreFacts.push(roomCorr(corrSpeaker, answer.room));
    coreFacts.push(weaponHint(hintSpeaker, answer.weapon));

    const err = verify(coreFacts, answer);
    if (err) continue;

    // Build vouch-pair tuples for noise construction (accuser constraint).
    const vouchPairs = edges.map(e => [e.from, e.to]);

    // Render deductive facts into clues.
    const deductiveClues = coreFacts.flatMap(f => factToClue(f, answer));

    // Killer's false alibi clue (decorative, not deductive).
    const decorative = [
      { speaker: answer.suspect, text: rand(TMPL.killerLie)(killerFakeRoom.name), deductive: false },
      { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand(innocents).name), accusation: true, deductive: false },
    ];

    const noiseClues = buildNoise({
      innocents,
      answer,
      victim,
      nonMurderRooms,
      nonMurderWeapons,
      vouches: vouchPairs,
      personalities,
    });

    const clues = deconflictConsecutive(shuffle([...deductiveClues, ...decorative, ...noiseClues]), c => c.speaker.name);
    const trustChain = { innocents, killerFakeRoom, structure: strategy.id };
    return { clues, trustChain };
  }

  throw new Error('Could not generate a valid game after ' + MAX_TRIES + ' tries');
}

export function buildExtraHints(answer, trustChain, victim) {
  const { killerFakeRoom } = trustChain;
  const nonWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const hints = [];

  if (nonWeapons.length) {
    const sw = rand(nonWeapons);
    hints.push({ speaker: null, text: rand(INVESTIGATION.weaponElim)(sw.name, sw.emoji) });
  }

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
  const personalities = assignPersonalities([...SUSPECTS, victim]);
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

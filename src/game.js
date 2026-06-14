import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, TMPL, GUARDIAN_ANGEL_LINES, GUARDIAN_ANGEL_EVIDENCE, WEAPON_ELIM } from './data.js';
import { rand, shuffle } from './utils.js';
import { vouch, witness, negation, roomCorr, weaponHint } from './facts.js';
import { pickStrategy } from './strategies/index.js';
import { factToClue, buildNoise } from './render.js';
import { verify } from './solver.js';

const MAX_TRIES = 50;

export function buildClues(answer, victim) {
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
      { speaker: answer.suspect, text: rand(TMPL.killerLie)(killerFakeRoom.name) },
      { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand(innocents).name), accusation: true },
    ];

    const noiseClues = buildNoise({
      innocents,
      answer,
      victim,
      nonMurderRooms,
      nonMurderWeapons,
      vouches: vouchPairs,
    });

    const clues = shuffle([...deductiveClues, ...decorative, ...noiseClues]);
    const trustChain = { innocents, killerFakeRoom, structure: strategy.id };
    return { clues, trustChain };
  }

  throw new Error('Could not generate a valid game after ' + MAX_TRIES + ' tries');
}

export function buildExtraHints(answer, trustChain, victim) {
  const { innocents, killerFakeRoom } = trustChain;
  const [A, B, C, D] = innocents;
  const nonWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const hints      = [];

  if (nonWeapons.length) {
    const sw = rand(nonWeapons);
    hints.push({ speaker: null, text: rand(WEAPON_ELIM)(sw.name, sw.emoji) });
  }

  hints.push({ speaker: C, text: rand(TMPL.roomHint)(answer.room.name) });
  hints.push({ speaker: D, text: rand(TMPL.rhBehavior)(answer.suspect.name) });
  hints.push({
    speaker: B,
    text: rand(TMPL.killerContradict)(answer.suspect.name, killerFakeRoom.name),
    accusation: true,
  });
  hints.push({ speaker: A, text: rand(TMPL.rhBehavior)(answer.suspect.name) });

  const revealRoom = Math.random() < 0.5;
  hints.push({
    speaker: victim,
    text: revealRoom
      ? rand(GUARDIAN_ANGEL_EVIDENCE.room)(answer.room.name)
      : rand(GUARDIAN_ANGEL_EVIDENCE.weapon)(answer.weapon.name),
    dead: true,
  });

  return hints;
}

export function createGame() {
  const answer = { suspect: rand(SUSPECTS), room: rand(ROOMS), weapon: rand(WEAPONS) };
  const extras = shuffle(EXTRAS.slice());
  const victim = extras[0];
  const silly  = [extras[1], extras[2]];
  const { clues, trustChain } = buildClues(answer, victim);
  const extraHints = buildExtraHints(answer, trustChain, victim);
  return { answer, victim, silly, clues, extraHints, trustChain };
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

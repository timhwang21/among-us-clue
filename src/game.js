import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, SILLY_LINES, GUARDIAN_ANGEL_LINES, GUARDIAN_ANGEL_EVIDENCE, TMPL, WEAPON_ELIM } from './data.js';
import { rand, shuffle } from './utils.js';

function buildTrustStructure(A, B, C, D, shuffledNMR) {
  const structure = rand(['two-pairs', 'chain', 'star']);

  if (structure === 'two-pairs') {
    const lieRoom = shuffledNMR[0], cdRoom = shuffledNMR[1], killerFakeRoom = shuffledNMR[2];
    return {
      structure, killerFakeRoom,
      featuredRooms: [lieRoom, cdRoom, killerFakeRoom],
      vouches: [[A, B], [B, A], [C, D], [D, C]],
      clues: [
        { speaker: A, text: rand(TMPL.alibi)(lieRoom.name) },
        { speaker: B, text: rand(TMPL.backing)(A.name, lieRoom.name) },
        { speaker: A, text: rand(TMPL.backing)(B.name, lieRoom.name) },
        { speaker: C, text: rand(TMPL.alibi)(cdRoom.name) },
        { speaker: D, text: rand(TMPL.backing)(C.name, cdRoom.name) },
        { speaker: C, text: rand(TMPL.backing)(D.name, cdRoom.name) },
      ],
    };
  }

  if (structure === 'chain') {
    // A vouches for B, B vouches for C, C vouches for D
    const rB = shuffledNMR[0], rC = shuffledNMR[1], rD = shuffledNMR[2], killerFakeRoom = shuffledNMR[3];
    return {
      structure, killerFakeRoom,
      featuredRooms: [rB, rC, rD, killerFakeRoom],
      vouches: [[A, B], [B, C], [C, D]],
      clues: [
        { speaker: B, text: rand(TMPL.alibi)(rB.name) },
        { speaker: A, text: rand(TMPL.backing)(B.name, rB.name) },
        { speaker: C, text: rand(TMPL.alibi)(rC.name) },
        { speaker: B, text: rand(TMPL.backing)(C.name, rC.name) },
        { speaker: D, text: rand(TMPL.alibi)(rD.name) },
        { speaker: C, text: rand(TMPL.backing)(D.name, rD.name) },
      ],
    };
  }

  // star: A vouches for B, C, and D independently
  const rB = shuffledNMR[0], rC = shuffledNMR[1], rD = shuffledNMR[2], killerFakeRoom = shuffledNMR[3];
  return {
    structure, killerFakeRoom,
    featuredRooms: [rB, rC, rD, killerFakeRoom],
    vouches: [[A, B], [A, C], [A, D]],
    clues: [
      { speaker: B, text: rand(TMPL.alibi)(rB.name) },
      { speaker: A, text: rand(TMPL.backing)(B.name, rB.name) },
      { speaker: C, text: rand(TMPL.alibi)(rC.name) },
      { speaker: A, text: rand(TMPL.backing)(C.name, rC.name) },
      { speaker: D, text: rand(TMPL.alibi)(rD.name) },
      { speaker: A, text: rand(TMPL.backing)(D.name, rD.name) },
    ],
  };
}

export function buildClues(answer, victim, silly) {
  const innocents = shuffle(SUSPECTS.filter(s => s.name !== answer.suspect.name));
  const A = innocents[0], B = innocents[1], C = innocents[2], D = innocents[3];

  const nonMurderRooms   = ROOMS.filter(r => r.name !== answer.room.name);
  const nonMurderWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const shuffledNMR      = shuffle(nonMurderRooms.slice());

  const trust = buildTrustStructure(A, B, C, D, shuffledNMR);
  const { killerFakeRoom, featuredRooms, vouches } = trust;

  const trustChain = { A, B, C, D, killerFakeRoom, structure: trust.structure };

  // Witness clue: an innocent directly saw the killer with the weapon or near the crime room
  const witnessSpeaker = rand([A, B, C, D]);
  const witnessClue = rand([true, false])
    ? { speaker: witnessSpeaker, text: rand(TMPL.witnessWeapon)(answer.suspect.name, answer.weapon.name) }
    : { speaker: witnessSpeaker, text: rand(TMPL.witnessRoom)(answer.suspect.name, answer.room.name) };

  const [corrSpeaker, hintSpeaker, wCorrSpeaker] = shuffle([A, B, C, D]);
  const core = [
    ...trust.clues,
    { speaker: answer.suspect, text: rand(TMPL.killerLie)(killerFakeRoom.name) },
    { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand([A, B, C, D]).name), accusation: true },
    { speaker: corrSpeaker,  text: rand(TMPL.roomCorr)(answer.room.name) },
    { speaker: hintSpeaker,  text: rand(TMPL.weaponHint)(answer.weapon.name) },
    { speaker: wCorrSpeaker, text: rand(TMPL.weaponCorr)(answer.weapon.name, answer.room.name) },
    witnessClue,
  ];

  const featuredRoomNames = new Set(featuredRooms.map(r => r.name));
  const rhRooms = shuffle(nonMurderRooms.filter(r => !featuredRoomNames.has(r.name)));
  const rh = [];

  const rhSpeakers = shuffle([A, B, C, D]);
  if (nonMurderWeapons.length && rhRooms.length)
    rh.push({ speaker: rhSpeakers[0], text: rand(TMPL.weaponCorr)(rand(nonMurderWeapons).name, rhRooms[0].name) });
  if (nonMurderWeapons.length > 1)
    rh.push({ speaker: rhSpeakers[1], text: rand(TMPL.rhWeapon)(rhSpeakers[2].name, nonMurderWeapons[1].name) });
  if (rhRooms.length > 1)
    rh.push({ speaker: rhSpeakers[3], text: rand(TMPL.rhRoom)(rhSpeakers[0].name, rhRooms[1].name) });

  const sillyPool = shuffle([A, B, C, D, answer.suspect]);
  rh.push({ speaker: sillyPool[0], text: rand(SILLY_LINES) });
  rh.push({ speaker: sillyPool[1], text: rand(SILLY_LINES) });
  rh.push({ speaker: victim, text: rand(GUARDIAN_ANGEL_LINES), dead: true });

  // Directional: prevent accuser from accusing someone they personally vouched for.
  // Bidirectional check caused infinite loops in the star structure (A vouches for B, C, D → A can never be in a valid pair).
  const accuserBacked = (accuser, target) =>
    vouches.some(([from, to]) => from === accuser && to === target);
  let accusers;
  do { accusers = shuffle([A, B, C, D]); }
  while (accuserBacked(accusers[0], accusers[1]) || accuserBacked(accusers[2], accusers[3]));
  rh.push({ speaker: accusers[0], text: rand(TMPL.rhAccuse)(accusers[0].name, accusers[1].name), accusation: true });
  rh.push({ speaker: accusers[2], text: rand(TMPL.rhAccuse)(accusers[2].name, accusers[3].name), accusation: true });

  return { clues: shuffle(core.concat(rh)), trustChain };
}

export function buildExtraHints(answer, trustChain, victim) {
  const tc         = trustChain;
  const nonWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const hints      = [];

  if (nonWeapons.length) {
    const sw = rand(nonWeapons);
    hints.push({ speaker: null, text: rand(WEAPON_ELIM)(sw.name, sw.emoji) });
  }

  hints.push({
    speaker: tc.C,
    text: rand(TMPL.roomHint)(answer.room.name),
  });

  hints.push({
    speaker: tc.D,
    text: rand(TMPL.rhBehavior)(answer.suspect.name),
  });

  hints.push({
    speaker: tc.B,
    text: rand(TMPL.killerContradict)(answer.suspect.name, tc.killerFakeRoom.name),
    accusation: true,
  });

  hints.push({
    speaker: tc.A,
    text: rand(TMPL.rhBehavior)(answer.suspect.name),
  });

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
  const { clues, trustChain } = buildClues(answer, victim, silly);
  const extraHints = buildExtraHints(answer, trustChain, victim);
  return { answer, victim, silly, clues, extraHints, trustChain };
}

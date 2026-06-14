import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, SILLY_LINES, TMPL } from './data.js';
import { rand, shuffle } from './utils.js';

export function buildClues(answer, victim, silly) {
  const innocents = shuffle(SUSPECTS.filter(s => s.name !== answer.suspect.name));
  const A = innocents[0], B = innocents[1], C = innocents[2], D = innocents[3];

  const nonMurderRooms   = ROOMS.filter(r => r.name !== answer.room.name);
  const nonMurderWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const shuffledNMR      = shuffle(nonMurderRooms.slice());
  const lieRoom          = shuffledNMR[0];
  const cdRoom           = shuffledNMR[1] || shuffledNMR[0];

  const trustChain = { A, B, C, D, lieRoom, cdRoom };

  const core = [
    { speaker: A, text: rand(TMPL.alibi)(lieRoom.name) },
    { speaker: B, text: rand(TMPL.backing)(A.name, lieRoom.name) },
    { speaker: C, text: rand(TMPL.alibi)(cdRoom.name) },
    { speaker: D, text: rand(TMPL.backing)(C.name, cdRoom.name) },
    { speaker: answer.suspect, text: rand(TMPL.killerLie)(lieRoom.name) },
    { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(D.name), accusation: true },
    { speaker: D, text: rand(TMPL.roomCorr)(answer.room.name) },
    { speaker: B, text: rand(TMPL.weaponHint)(answer.weapon.name) },
    { speaker: A, text: rand(TMPL.weaponCorr)(answer.weapon.name, answer.room.name) },
  ];

  const rhRooms = shuffle(nonMurderRooms.filter(r =>
    r.name !== lieRoom.name && r.name !== cdRoom.name
  ));
  const rh = [];

  if (nonMurderWeapons.length && rhRooms.length)
    rh.push({ speaker: B, text: rand(TMPL.weaponCorr)(rand(nonMurderWeapons).name, rhRooms[0].name) });
  if (nonMurderWeapons.length > 1)
    rh.push({ speaker: C, text: rand(TMPL.rhWeapon)(D.name, nonMurderWeapons[1].name) });
  if (rhRooms.length > 1)
    rh.push({ speaker: D, text: rand(TMPL.rhRoom)(B.name, rhRooms[1].name) });

  rh.push({ speaker: silly[0], text: rand(SILLY_LINES) });
  rh.push({ speaker: silly[1], text: rand(SILLY_LINES) });

  const accusers = shuffle([A, B, C, D]);
  rh.push({ speaker: accusers[0], text: rand(TMPL.rhAccuse)(accusers[0].name, accusers[1].name), accusation: true });
  rh.push({ speaker: accusers[2], text: rand(TMPL.rhAccuse)(accusers[2].name, accusers[3].name), accusation: true });

  return { clues: shuffle(core.concat(rh)), trustChain };
}

export function buildExtraHints(answer, trustChain) {
  const tc         = trustChain;
  const nonWeapons = WEAPONS.filter(w => w.name !== answer.weapon.name);
  const hints      = [];

  if (nonWeapons.length) {
    const sw = nonWeapons[0];
    hints.push({
      speaker: null,
      text: `The ${sw.name} ${sw.emoji} was found exactly where it belongs — undisturbed in storage. It wasn't used.`,
    });
  }

  hints.push({
    speaker: tc.C,
    text: rand(TMPL.roomHint)(answer.room.name),
  });

  hints.push({
    speaker: tc.A,
    text: rand(TMPL.backing)(tc.B.name, tc.lieRoom.name),
  });

  hints.push({
    speaker: tc.A,
    text: rand(TMPL.accusation)(answer.suspect.name, tc.lieRoom.name),
    accusation: true,
  });

  hints.push({
    speaker: tc.C,
    text: rand(TMPL.backing)(tc.D.name, tc.cdRoom.name),
  });

  return hints;
}

export function createGame() {
  const answer = { suspect: rand(SUSPECTS), room: rand(ROOMS), weapon: rand(WEAPONS) };
  const extras = shuffle(EXTRAS.slice());
  const victim = extras[0];
  const silly  = [extras[1], extras[2]];
  const { clues, trustChain } = buildClues(answer, victim, silly);
  const extraHints = buildExtraHints(answer, trustChain);
  return { answer, victim, silly, clues, extraHints, trustChain };
}

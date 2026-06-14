import { TYPE } from './facts.js';
import { TMPL, SILLY_LINES, GUARDIAN_ANGEL_LINES } from './data.js';
import { rand, shuffle } from './utils.js';

// Turn one deductive fact into a rendered clue object { speaker, text, accusation?, dead? }.
export function factToClue(fact, answer) {
  switch (fact.type) {
    case TYPE.VOUCH:
      return [
        { speaker: fact.to,   text: rand(TMPL.alibi)(fact.room.name) },
        { speaker: fact.from, text: rand(TMPL.backing)(fact.to.name, fact.room.name) },
      ];

    case TYPE.KILLER_LIE:
      return [
        { speaker: answer.suspect, text: rand(TMPL.killerLie)(fact.room.name) },
        { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand(fact._innocents).name), accusation: true },
      ];

    case TYPE.WITNESS:
      // kind='suspect' directly names the killer (lone-wolf strategy only).
      if (fact.kind === 'suspect')
        return [{ speaker: fact.speaker, text: rand(TMPL.witnessWeapon)(answer.suspect.name, answer.weapon.name) }];
      if (fact.kind === 'weapon')
        return [{ speaker: fact.speaker, text: rand(TMPL.witnessWeapon)(answer.suspect.name, answer.weapon.name) }];
      return [{ speaker: fact.speaker, text: rand(TMPL.witnessRoom)(answer.suspect.name, answer.room.name) }];

    case TYPE.ROOM_CORR:
      return [{ speaker: fact.speaker, text: rand(TMPL.roomCorr)(answer.room.name) }];

    case TYPE.WEAPON_HINT:
      return [{ speaker: fact.speaker, text: rand(TMPL.weaponHint)(answer.weapon.name) }];

    case TYPE.WEAPON_ELIM:
      // weaponElim is only used as an extra hint; not rendered inline.
      return [];

    default:
      return [];
  }
}

// Build the non-deductive noise clues: silly, ghost flavor, behavioral red herrings,
// hysterical accusations, weapon/room corroboration red herrings.
export function buildNoise({ innocents, answer, victim, nonMurderRooms, nonMurderWeapons, vouches }) {
  const rh = [];
  const shuffledInnocents = shuffle(innocents.slice());
  const [sp0, sp1, sp2, sp3] = shuffledInnocents;

  // Red-herring weapon/room corroboration clues pointing to wrong answers.
  const rhRooms = shuffle(nonMurderRooms.slice());
  if (nonMurderWeapons.length && rhRooms.length)
    rh.push({ speaker: sp0, text: rand(TMPL.weaponCorr)(rand(nonMurderWeapons).name, rhRooms[0].name) });
  if (nonMurderWeapons.length > 1)
    rh.push({ speaker: sp1, text: rand(TMPL.rhWeapon)(sp2.name, nonMurderWeapons[1].name) });
  if (rhRooms.length > 1)
    rh.push({ speaker: sp3, text: rand(TMPL.rhRoom)(sp0.name, rhRooms[1].name) });

  // Silly flavor lines.
  const sillyPool = shuffle([...innocents, answer.suspect]);
  rh.push({ speaker: sillyPool[0], text: rand(SILLY_LINES) });
  rh.push({ speaker: sillyPool[1], text: rand(SILLY_LINES) });

  // Ghost/guardian angel flavor clue from victim.
  rh.push({ speaker: victim, text: rand(GUARDIAN_ANGEL_LINES), dead: true });

  // Hysterical accusations — accuser must not have personally vouched for their target.
  const accuserBacked = (accuser, target) =>
    vouches.some(([from, to]) => from === accuser && to === target);
  let accusers;
  do { accusers = shuffle(innocents.slice()); }
  while (accuserBacked(accusers[0], accusers[1]) || accuserBacked(accusers[2], accusers[3]));
  rh.push({ speaker: accusers[0], text: rand(TMPL.rhAccuse)(accusers[0].name, accusers[1].name), accusation: true });
  rh.push({ speaker: accusers[2], text: rand(TMPL.rhAccuse)(accusers[2].name, accusers[3].name), accusation: true });

  return rh;
}

// Build the real weapon/room corroboration that IS part of the deductive core.
export function buildCoreCorroboration({ answer, speaker1, speaker2, speaker3 }) {
  return [
    { speaker: speaker1, text: rand(TMPL.roomCorr)(answer.room.name) },
    { speaker: speaker2, text: rand(TMPL.weaponHint)(answer.weapon.name) },
    { speaker: speaker3, text: rand(TMPL.weaponCorr)(answer.weapon.name, answer.room.name) },
  ];
}

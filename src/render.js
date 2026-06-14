import { TYPE } from './facts.js';
import { TMPL, SILLY_LINES, GUARDIAN_ANGEL_LINES, PERSONALITY_LINES } from './data.js';
import { rand, shuffle } from './utils.js';

// Turn one deductive fact into a rendered clue object { speaker, text, accusation?, dead? }.
export function factToClue(fact, answer) {
  switch (fact.type) {
    case TYPE.VOUCH:
      return [
        { speaker: fact.to,   text: rand(TMPL.alibi)(fact.room.name), deductive: true },
        { speaker: fact.from, text: rand(TMPL.backing)(fact.to.name, fact.room.name), deductive: true },
      ];

    case TYPE.KILLER_LIE:
      return [
        { speaker: answer.suspect, text: rand(TMPL.killerLie)(fact.room.name), deductive: true },
        { speaker: answer.suspect, text: rand(TMPL.killerDeflect)(rand(fact._innocents).name), accusation: true, deductive: true },
      ];

    case TYPE.WITNESS:
      // kind='suspect' directly names the killer (lone-wolf strategy only).
      if (fact.kind === 'suspect')
        return [{ speaker: fact.speaker, text: rand(TMPL.witnessWeapon)(answer.suspect.name, answer.weapon.name), deductive: true }];
      if (fact.kind === 'weapon')
        return [{ speaker: fact.speaker, text: rand(TMPL.witnessWeapon)(answer.suspect.name, answer.weapon.name), deductive: true }];
      return [{ speaker: fact.speaker, text: rand(TMPL.witnessRoom)(answer.suspect.name, answer.room.name), deductive: true }];

    case TYPE.NEGATION:
      // An innocent contradicts the killer's fake alibi: "I was in [fakeRoom] — [killer] wasn't there."
      return [{ speaker: fact.speaker, text: rand(TMPL.killerContradict)(answer.suspect.name, fact.fakeRoom.name), accusation: true, deductive: true }];

    case TYPE.ROOM_CORR:
      return [{ speaker: fact.speaker, text: rand(TMPL.roomCorr)(answer.room.name), deductive: true }];

    case TYPE.WEAPON_HINT:
      return [{ speaker: fact.speaker, text: rand(TMPL.weaponHint)(answer.weapon.name), deductive: true }];

    case TYPE.WEAPON_ELIM:
      // weaponElim is only used as an extra hint; not rendered inline.
      return [];

    default:
      return [];
  }
}

// Build the non-deductive noise clues: silly, ghost flavor, behavioral red herrings,
// hysterical accusations, weapon/room corroboration red herrings, personality flavor.
export function buildNoise({ innocents, answer, victim, nonMurderRooms, nonMurderWeapons, vouches, personalities = {} }) {
  const rh = [];
  const shuffledInnocents = shuffle(innocents.slice());
  const [sp0, sp1, sp2, sp3] = shuffledInnocents;

  // Red-herring weapon/room corroboration clues pointing to wrong answers.
  const rhRooms = shuffle(nonMurderRooms.slice());
  if (nonMurderWeapons.length && rhRooms.length)
    rh.push({ speaker: sp0, text: rand(TMPL.weaponCorr)(rand(nonMurderWeapons).name, rhRooms[0].name), deductive: false });
  if (nonMurderWeapons.length > 1)
    rh.push({ speaker: sp1, text: rand(TMPL.rhWeapon)(sp2.name, nonMurderWeapons[1].name), deductive: false });
  if (rhRooms.length > 1)
    rh.push({ speaker: sp3, text: rand(TMPL.rhRoom)(sp0.name, rhRooms[1].name), deductive: false });

  // Fake weapon-missing clue: one innocent reports a non-murder weapon missing, creating
  // uncertainty about which missing-weapon claim is the real evidence.
  if (nonMurderWeapons.length) {
    const rhWeapon = rand(nonMurderWeapons);
    rh.push({ speaker: rand(innocents), text: rand(TMPL.weaponHint)(rhWeapon.name), deductive: false });
  }

  // Ghost/guardian angel flavor clue from victim.
  rh.push({ speaker: victim, text: rand(GUARDIAN_ANGEL_LINES), dead: true, deductive: false });

  // Hysterical accusations — accuser must not have personally vouched for their target.
  // These come from the generic rhAccuse pool, not a personality pool, so no personality tag.
  const accuserBacked = (accuser, target) =>
    vouches.some(([from, to]) => from === accuser && to === target);
  let accusers;
  do { accusers = shuffle(innocents.slice()); }
  while (accuserBacked(accusers[0], accusers[1]) || accuserBacked(accusers[2], accusers[3]));
  rh.push({ speaker: accusers[0], text: rand(TMPL.rhAccuse)(accusers[0].name, accusers[1].name), accusation: true, deductive: false });
  rh.push({ speaker: accusers[2], text: rand(TMPL.rhAccuse)(accusers[2].name, accusers[3].name), accusation: true, deductive: false });

  // Personality flavor: one extra line per personality-typed suspect, tagged with their personality.
  const allCrewmates = [...innocents, answer.suspect];
  for (const crewmate of allCrewmates) {
    const ptype = personalities[crewmate.name];
    if (!ptype) continue;
    if (ptype === 'silly') {
      rh.push({ speaker: crewmate, text: rand(SILLY_LINES), deductive: false, personality: 'silly' });
    } else if (ptype === 'hysterical') {
      const targets = allCrewmates.filter(c => c.name !== crewmate.name);
      rh.push({ speaker: crewmate, text: rand(PERSONALITY_LINES.hysterical)(rand(targets).name), accusation: true, deductive: false, personality: 'hysterical' });
    } else if (ptype === 'peacemaker') {
      rh.push({ speaker: crewmate, text: rand(PERSONALITY_LINES.peacemaker), deductive: false, personality: 'peacemaker' });
    } else if (ptype === 'salty') {
      rh.push({ speaker: crewmate, text: rand(PERSONALITY_LINES.salty), deductive: false, personality: 'salty' });
    } else if (ptype === 'overconfident') {
      rh.push({ speaker: crewmate, text: rand(PERSONALITY_LINES.overconfident), deductive: false, personality: 'overconfident' });
    }
  }

  return rh;
}

// Build the real weapon/room corroboration that IS part of the deductive core.
export function buildCoreCorroboration({ answer, speaker1, speaker2, speaker3 }) {
  return [
    { speaker: speaker1, text: rand(TMPL.roomCorr)(answer.room.name), deductive: true },
    { speaker: speaker2, text: rand(TMPL.weaponHint)(answer.weapon.name), deductive: true },
    { speaker: speaker3, text: rand(TMPL.weaponCorr)(answer.weapon.name, answer.room.name), deductive: true },
  ];
}

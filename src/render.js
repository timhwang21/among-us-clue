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
      return [{ speaker: fact.speaker, text: rand(TMPL.weaponElim)(fact.weapon.name), deductive: true }];

    default:
      return [];
  }
}

// Build the non-deductive noise clues: silly, ghost flavor, room red herrings, personality flavor.
// Weapon noise clues are intentionally omitted — innocents formally account for all non-murder
// weapons via deductive weaponElim facts, and contradictory noise would confuse the deduction.
export function buildNoise({ innocents, answer, victim, nonMurderRooms, personalities = {} }) {
  const rh = [];
  const [sp0, , , sp3] = shuffle(innocents.slice());

  // Room red herring: one innocent places another in a wrong room.
  const rhRooms = shuffle(nonMurderRooms.slice());
  if (rhRooms.length)
    rh.push({ speaker: sp3, text: rand(TMPL.rhRoom)(sp0.name, rhRooms[0].name), deductive: false });

  // Personality flavor: one extra line per personality-typed crewmate (includes victim via 'dead').
  const allCrewmates = [...innocents, answer.suspect, victim];
  for (const crewmate of allCrewmates) {
    const ptype = personalities[crewmate.name];
    if (!ptype) continue;
    if (ptype === 'dead') {
      rh.push({ speaker: crewmate, text: rand(GUARDIAN_ANGEL_LINES), dead: true, deductive: false, personality: 'dead' });
    } else if (ptype === 'silly') {
      rh.push({ speaker: crewmate, text: rand(SILLY_LINES), deductive: false, personality: 'silly' });
    } else if (ptype === 'hysterical') {
      const targets = allCrewmates.filter(c => c.name !== crewmate.name && c.name !== victim.name);
      rh.push({ speaker: crewmate, text: rand(TMPL.rhAccuse)(crewmate.name, rand(targets).name), accusation: true, deductive: false, personality: 'hysterical' });
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

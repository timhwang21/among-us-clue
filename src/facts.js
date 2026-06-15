// Abstract fact schema — the contract between strategies, solver, and renderer.
// Facts carry no template text; they are pure data over suspect/room/weapon refs.

export const TYPE = {
  VOUCH:       'vouch',       // `from` testifies `to` was in `room`
  KILLER_LIE:  'killerLie',   // killer's false alibi room
  WITNESS:     'witness',     // innocent directly names killer (kind: 'suspect'|'room'|'weapon')
  ROOM_CORR:   'roomCorr',    // corroborates the murder room
  WEAPON_HINT: 'weaponHint',  // murder weapon missing from storage
  WEAPON_ELIM: 'weaponElim',  // a non-murder weapon, ruled out
  NEGATION:    'negation',    // innocent contradicts killer's fake alibi: "killer was NOT in fakeRoom"
};

export const vouch       = (from, to, room)        => ({ type: TYPE.VOUCH,       from, to, room });
export const killerLie   = (room)                   => ({ type: TYPE.KILLER_LIE,  room });
export const witness     = (speaker, kind, value)   => ({ type: TYPE.WITNESS,     speaker, kind, value });
export const roomCorr    = (speaker, room)           => ({ type: TYPE.ROOM_CORR,   speaker, room });
export const weaponHint  = (speaker, weapon)         => ({ type: TYPE.WEAPON_HINT, speaker, weapon });
// flavor is render-only ('possession' = "I had it"; 'observation' = "saw it in storage"); the
// solver treats both identically. Mixing flavors is purely cosmetic variance.
export const weaponElim  = (speaker, weapon, flavor = 'possession') => ({ type: TYPE.WEAPON_ELIM, speaker, weapon, flavor });
// negation: speaker (innocent) says `killer` was NOT in `fakeRoom`, contradicting the killer's lie.
// The speaker must be proven innocent before it fires (same deductive power as witness kind='suspect',
// but rendered with killerContradict flavor instead of a direct accusation).
export const negation    = (speaker, killer, fakeRoom) => ({ type: TYPE.NEGATION, speaker, killer, fakeRoom });

// Abstract fact schema — the contract between strategies, solver, and renderer.
// Facts carry no template text; they are pure data over suspect/room/weapon refs.

export const TYPE = {
  VOUCH:       'vouch',       // `from` testifies `to` was in `room`
  KILLER_LIE:  'killerLie',   // killer's false alibi room
  WITNESS:     'witness',     // innocent directly names killer (kind: 'room'|'weapon')
  ROOM_CORR:   'roomCorr',    // corroborates the murder room
  WEAPON_HINT: 'weaponHint',  // murder weapon missing from storage
  WEAPON_ELIM: 'weaponElim',  // a non-murder weapon, ruled out
};

export const vouch       = (from, to, room)       => ({ type: TYPE.VOUCH,       from, to, room });
export const killerLie   = (room)                  => ({ type: TYPE.KILLER_LIE,  room });
export const witness     = (speaker, kind, value)  => ({ type: TYPE.WITNESS,     speaker, kind, value });
export const roomCorr    = (speaker, room)          => ({ type: TYPE.ROOM_CORR,   speaker, room });
export const weaponHint  = (speaker, weapon)        => ({ type: TYPE.WEAPON_HINT, speaker, weapon });
export const weaponElim  = (weapon)                 => ({ type: TYPE.WEAPON_ELIM, weapon });

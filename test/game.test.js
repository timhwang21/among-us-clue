import { describe, it, expect } from 'vitest';
import { createGame } from '../src/game.js';
import { SUSPECTS, EXTRAS, ROOMS, WEAPONS, SILLY_LINES } from '../src/data.js';

const ROOM_HINT_PHRASES = [
  'found the body',
  'door was forced open',
  'called the emergency meeting',
  'hit the emergency button',
];

describe('createGame', () => {
  it('returns the required shape', () => {
    const game = createGame();
    expect(game).toHaveProperty('answer');
    expect(game).toHaveProperty('victim');
    expect(game).toHaveProperty('clues');
    expect(game).toHaveProperty('extraHints');
    expect(game).toHaveProperty('trustChain');
    expect(game).toHaveProperty('personalities');
  });

  it('answer.suspect is from SUSPECTS', () => {
    const { answer } = createGame();
    expect(SUSPECTS).toContainEqual(answer.suspect);
  });

  it('answer.room is from ROOMS', () => {
    const { answer } = createGame();
    expect(ROOMS).toContainEqual(answer.room);
  });

  it('answer.weapon is from WEAPONS', () => {
    const { answer } = createGame();
    expect(WEAPONS).toContainEqual(answer.weapon);
  });

  it('victim is from EXTRAS', () => {
    const { victim } = createGame();
    expect(EXTRAS).toContainEqual(victim);
  });

  it('all clues have a speaker with name/color/dark and non-empty text', () => {
    const { clues } = createGame();
    for (const clue of clues) {
      expect(clue.speaker).toBeTruthy();
      expect(typeof clue.speaker.name).toBe('string');
      expect(clue.speaker.name.length).toBeGreaterThan(0);
      expect(typeof clue.speaker.color).toBe('string');
      expect(typeof clue.speaker.dark).toBe('string');
      expect(typeof clue.text).toBe('string');
      expect(clue.text.length).toBeGreaterThan(0);
    }
  });

  it('killer appears as speaker in at least 2 base clues', () => {
    const { answer, clues } = createGame();
    const killerClues = clues.filter(c => c.speaker.name === answer.suspect.name);
    expect(killerClues.length).toBeGreaterThanOrEqual(2);
  });

  it("killer's deflect clue has accusation: true", () => {
    const { answer, clues } = createGame();
    const killerAccusations = clues.filter(
      c => c.speaker.name === answer.suspect.name && c.accusation === true
    );
    expect(killerAccusations.length).toBeGreaterThanOrEqual(1);
  });

  it('at least 2 hysterical accusation clues from non-killer speakers', () => {
    const { answer, clues } = createGame();
    const innocentAccusations = clues.filter(
      c => c.accusation === true && c.speaker.name !== answer.suspect.name
    );
    expect(innocentAccusations.length).toBeGreaterThanOrEqual(2);
  });

  it('silly personality clues come from SILLY_LINES', () => {
    const { clues } = createGame();
    for (const c of clues.filter(c => c.personality === 'silly')) {
      expect(SILLY_LINES).toContain(c.text);
    }
  });

  it('exactly 1 guardian angel clue from victim with dead: true', () => {
    const { victim, clues } = createGame();
    const ghostClues = clues.filter(c => c.speaker.name === victim.name && c.dead === true);
    expect(ghostClues).toHaveLength(1);
  });

  it('trustChain has innocents array, killerFakeRoom, and structure', () => {
    const { trustChain } = createGame();
    expect(Array.isArray(trustChain.innocents)).toBe(true);
    expect(trustChain.innocents.length).toBe(4);
    expect(trustChain.killerFakeRoom).toBeTruthy();
    expect(typeof trustChain.structure).toBe('string');
  });

  it('guardian angel base clue has no helpful keywords', () => {
    const { victim, answer, clues } = createGame();
    const ghostClue = clues.find(c => c.speaker.name === victim.name && c.dead === true);
    expect(ghostClue).toBeDefined();
    expect(ghostClue.text).not.toContain(answer.room.name);
    expect(ghostClue.text).not.toContain(answer.weapon.name);
    expect(ghostClue.text).not.toContain(answer.suspect.name);
  });

  it('no roomHint phrases in base clues', () => {
    const { clues } = createGame();
    for (const clue of clues) {
      for (const phrase of ROOM_HINT_PHRASES) {
        expect(clue.text).not.toContain(phrase);
      }
    }
  });

  it('extraHints has exactly 6 entries', () => {
    const { extraHints } = createGame();
    expect(extraHints).toHaveLength(6);
  });

  it('all extraHints have non-empty text', () => {
    const { extraHints } = createGame();
    for (const hint of extraHints) {
      expect(typeof hint.text).toBe('string');
      expect(hint.text.length).toBeGreaterThan(0);
    }
  });

  it('extraHints[3] (4th) has no accusation flag', () => {
    const { extraHints } = createGame();
    expect(extraHints[3].accusation).toBeFalsy();
  });

  it('extraHints[0] (weapon elimination) does NOT mention the murder weapon name', () => {
    const { answer, extraHints } = createGame();
    expect(extraHints[0].text).not.toContain(answer.weapon.name);
  });

  it('extraHints[1] (body found) DOES mention the murder room name', () => {
    const { answer, extraHints } = createGame();
    expect(extraHints[1].text).toContain(answer.room.name);
  });

  it('extraHints[3] (alibi contradiction) mentions killer name and killerFakeRoom', () => {
    const { answer, trustChain, extraHints } = createGame();
    expect(extraHints[3].text).toContain(answer.suspect.name);
    expect(extraHints[3].text).toContain(trustChain.killerFakeRoom.name);
    expect(extraHints[3].speaker).toBeNull();
  });

  it('extraHints[2] and [4] (behavioral) name the killer and have no accusation flag', () => {
    const { answer, extraHints } = createGame();
    expect(extraHints[2].text).toContain(answer.suspect.name);
    expect(extraHints[4].text).toContain(answer.suspect.name);
    expect(extraHints[2].accusation).toBeFalsy();
    expect(extraHints[4].accusation).toBeFalsy();
  });

  it('last extraHint is a journal investigation with speaker: null', () => {
    const { answer, extraHints } = createGame();
    const last = extraHints[extraHints.length - 1];
    expect(last.speaker).toBeNull();
    const mentionsRoom = last.text.includes(answer.room.name);
    const mentionsWeapon = last.text.includes(answer.weapon.name);
    expect(mentionsRoom || mentionsWeapon).toBe(true);
  });

  it('guardian angel extra hint mentions the murder room or murder weapon', () => {
    const { answer, extraHints } = createGame();
    const last = extraHints[extraHints.length - 1];
    const mentionsRoom = last.text.includes(answer.room.name);
    const mentionsWeapon = last.text.includes(answer.weapon.name);
    expect(mentionsRoom || mentionsWeapon).toBe(true);
  });

});

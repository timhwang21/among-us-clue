import { describe, it, expect } from 'vitest';
import { solve, verify, isSolvable, isMinimal, countConsistentCandidates } from '../src/solver.js';
import { vouch, roomCorr, weaponHint, witness } from '../src/facts.js';
import { SUSPECTS, ROOMS, WEAPONS } from '../src/data.js';
import { createGame } from '../src/game.js';

const [Red, Blue, Green, Purple, Yellow] = SUSPECTS;
const [Cafeteria, Electrical, Navigation, MedBay] = ROOMS;
const [Wrench, Knife] = WEAPONS;

// A minimal solvable fact set: chain A→B→C→D + room + weapon
const minimalChainFacts = () => [
  vouch(Red, Blue, Cafeteria),
  vouch(Blue, Green, Electrical),
  vouch(Green, Purple, Navigation),
  roomCorr(Red, MedBay),
  weaponHint(Blue, Wrench),
];
// Answer: Yellow (killer), MedBay, Wrench

describe('solve', () => {
  it('derives killer via 4-innocent chain', () => {
    const r = solve(minimalChainFacts());
    expect(r.killer).toBe('Yellow');
    expect(r.room).toBe('MedBay');
    expect(r.weapon).toBe('Wrench');
  });

  it('propagates innocence through the trust chain', () => {
    const r = solve(minimalChainFacts());
    expect(r.innocents.has('Red')).toBe(true);
    expect(r.innocents.has('Blue')).toBe(true);
    expect(r.innocents.has('Green')).toBe(true);
    expect(r.innocents.has('Purple')).toBe(true);
  });

  it('derives all innocents once killer is known via witness', () => {
    const facts = [
      vouch(Red, Blue, Cafeteria),    // proves Red + Blue innocent
      vouch(Blue, Green, Electrical), // proves Green innocent
      // Purple and Yellow unknown via trust chain
      witness(Red, 'suspect', Yellow), // Red (innocent) names Yellow as killer
      roomCorr(Green, MedBay),
      weaponHint(Blue, Wrench),
    ];
    const r = solve(facts);
    expect(r.killer).toBe('Yellow');
    expect(r.innocents.has('Purple')).toBe(true); // reverse elimination fired
  });

  it('returns null for unsolvable facts', () => {
    const r = solve([vouch(Red, Blue, Cafeteria)]);
    expect(r.killer).toBeNull();
    expect(r.room).toBeNull();
    expect(r.weapon).toBeNull();
  });
});

describe('verify', () => {
  const answer = { suspect: Yellow, room: MedBay, weapon: Wrench };

  it('accepts a valid minimal fact set', () => {
    expect(verify(minimalChainFacts(), answer)).toBeNull();
  });

  it('rejects when the game is not solvable', () => {
    const facts = [roomCorr(Red, MedBay), weaponHint(Blue, Wrench)]; // no trust chain
    expect(verify(facts, answer)).not.toBeNull();
  });

  it('rejects when the killer is a voucher', () => {
    const facts = [
      vouch(Yellow, Blue, Cafeteria), // killer vouches — violation
      vouch(Blue, Green, Electrical),
      vouch(Green, Purple, Navigation),
      roomCorr(Red, MedBay),
      weaponHint(Blue, Wrench),
    ];
    expect(verify(facts, answer)).toMatch(/vouch integrity/);
  });

  it('rejects when the killer is vouched-for', () => {
    const facts = [
      vouch(Red, Yellow, Cafeteria), // killer is vouched-for — violation
      vouch(Red, Blue, Electrical),
      vouch(Blue, Green, Navigation),
      roomCorr(Red, MedBay),
      weaponHint(Blue, Wrench),
    ];
    expect(verify(facts, answer)).toMatch(/vouch integrity/);
  });

  it('rejects redundant closing facts (both roomCorr and weaponCorr give room info)', () => {
    const facts = [
      ...minimalChainFacts(),
      roomCorr(Purple, MedBay), // second roomCorr is redundant
    ];
    expect(verify(facts, answer)).toMatch(/redundant/);
  });
});

describe('property tests: createGame always produces valid games', () => {
  const RUNS = 100;

  it('every game is solvable and passes verify()', () => {
    for (let i = 0; i < RUNS; i++) {
      const game = createGame();
      const { answer, trustChain } = game;
      // trustChain shape
      expect(trustChain.innocents).toHaveLength(4);
      expect(SUSPECTS).toContainEqual(answer.suspect);
      expect(ROOMS).toContainEqual(answer.room);
      expect(WEAPONS).toContainEqual(answer.weapon);
    }
  });

  it('killer never appears as voucher in any game', () => {
    for (let i = 0; i < RUNS; i++) {
      const { answer, trustChain } = createGame();
      expect(trustChain.innocents.map(s => s.name)).not.toContain(answer.suspect.name);
    }
  });

  it('all 6 strategy types appear across many games', () => {
    const seen = new Set();
    for (let i = 0; i < 300; i++) {
      seen.add(createGame().trustChain.structure);
    }
    expect(seen.has('two-pairs')).toBe(true);
    expect(seen.has('chain')).toBe(true);
    expect(seen.has('star')).toBe(true);
    expect(seen.has('cycle')).toBe(true);
    expect(seen.has('fork')).toBe(true);
    expect(seen.has('lone-wolf')).toBe(true);
  });
});

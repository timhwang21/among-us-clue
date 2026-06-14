import { vouch } from '../facts.js';

// Lone-wolf: trust chain proves only 3 innocents (A→B→C); the witness fact is the SOLE
// proof of either the killer's identity or D's innocence — not a duplicate of the trust path.
// game.js must supply a witness fact to make this solvable; verify() enforces minimality.
export default {
  id: 'lone-wolf',
  difficulty: 3,
  // Returns only 3-innocent edges; game.js adds the closing witness fact.
  build(innocents, rooms) {
    const [A, B, C] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(B, C, rooms[1])],
      killerFakeRoom: rooms[2],
      requiresWitness: true,
    };
  },
};

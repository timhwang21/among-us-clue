import { vouch } from '../facts.js';

// Two mutual pairs: A↔B and C↔D
// Deduction: symmetric vouching → both pairs provably innocent → 5th is killer.
export default {
  id: 'two-pairs',
  difficulty: 1,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(B, A, rooms[0]), vouch(C, D, rooms[1]), vouch(D, C, rooms[1])],
      killerFakeRoom: rooms[2],
    };
  },
};

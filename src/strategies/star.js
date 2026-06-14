import { vouch } from '../facts.js';

// Star: A→B, A→C, A→D
// Deduction: A vouches for three → A innocent → B, C, D all innocent → 5th is killer.
export default {
  id: 'star',
  difficulty: 2,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(A, C, rooms[1]), vouch(A, D, rooms[2])],
      killerFakeRoom: rooms[3],
    };
  },
};

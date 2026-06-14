import { vouch } from '../facts.js';

// Chain: A→B→C→D
// Deduction: A vouches → A innocent → B innocent → C innocent → D innocent → 5th is killer.
export default {
  id: 'chain',
  difficulty: 2,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(B, C, rooms[1]), vouch(C, D, rooms[2])],
      killerFakeRoom: rooms[3],
    };
  },
};

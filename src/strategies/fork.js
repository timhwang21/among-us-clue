import { vouch } from '../facts.js';

// Fork / cross-corroboration: A→B, A→C, D→B
// Two independent witnesses (A and D) both confirm B. A also confirms C.
// Deduction: A vouches → A innocent → B, C innocent. D vouches → D innocent. All 4 innocent → 5th is killer.
// The cross-corroboration on B adds an extra trust signal that makes D's innocence derivable.
export default {
  id: 'fork',
  difficulty: 3,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(A, C, rooms[1]), vouch(D, B, rooms[0])],
      killerFakeRoom: rooms[2],
    };
  },
};

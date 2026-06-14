import { vouch } from '../facts.js';

// Two short chains: A→B, C→D
// Two parallel one-step vouches; no reciprocity (unlike two-pairs).
// Deduction: A vouches → A innocent → B innocent. C vouches → C innocent → D innocent.
// Four innocents → 5th is killer.
// Subtler than two-pairs: the lack of symmetric backing means each chain must be recognized
// independently without mutual confirmation to anchor it.
export default {
  id: 'two-chains',
  difficulty: 2,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(C, D, rooms[1])],
      killerFakeRoom: rooms[2],
    };
  },
};

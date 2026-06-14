import { vouch } from '../facts.js';

// Y / converging: A→C, B→C, C→D
// Two independent witnesses (A and B) both corroborate C, then C extends the chain.
// Deduction: A vouches → A innocent → C innocent. B vouches → B innocent → C innocent (already).
// C innocent → D innocent. All 4 innocent → 5th is killer.
// Harder than chain because neither A nor B starts an obvious single chain.
export default {
  id: 'y-converging',
  difficulty: 3,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, C, rooms[0]), vouch(B, C, rooms[0]), vouch(C, D, rooms[1])],
      killerFakeRoom: rooms[2],
    };
  },
};

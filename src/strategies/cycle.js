import { vouch } from '../facts.js';

// Cycle: A→B→C→D→A
// Deduction: any single vouching node proves the whole cycle innocent.
// Slightly harder: players must recognize the ring structure and start the chain from any node.
export default {
  id: 'cycle',
  difficulty: 2,
  build(innocents, rooms) {
    const [A, B, C, D] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(B, C, rooms[1]), vouch(C, D, rooms[2]), vouch(D, A, rooms[3])],
      killerFakeRoom: rooms[4],
    };
  },
};

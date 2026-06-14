import { vouch } from '../facts.js';

// Negation testimony: A→B→C (3 innocents via trust chain) + a negation closing fact.
// A proven innocent says "[killer] was NOT in [fakeRoom]", contradicting the killer's false alibi.
// Deduction: A→B→C proves three innocents. The negation names the killer indirectly — a player
// must connect "who denied the alibi" (an innocent) with "who claimed that alibi" (the killer).
// Different flavor from lone-wolf: the denial is the evidence, not a direct sighting.
export default {
  id: 'negation-testimony',
  difficulty: 3,
  requiresNegation: true,  // signals game.js to add a negation closing fact
  build(innocents, rooms) {
    const [A, B, C] = innocents;
    return {
      edges: [vouch(A, B, rooms[0]), vouch(B, C, rooms[1])],
      killerFakeRoom: rooms[2],
    };
  },
};

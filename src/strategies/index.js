import twoPairs          from './twoPairs.js';
import chain             from './chain.js';
import star              from './star.js';
import cycle             from './cycle.js';
import fork              from './fork.js';
import loneWolf          from './loneWolf.js';
import yConverging       from './yConverging.js';
import twoChains         from './twoChains.js';
import negationTestimony from './negationTestimony.js';
import { rand } from '../utils.js';

export const STRATEGIES = [twoPairs, chain, star, cycle, fork, loneWolf, yConverging, twoChains, negationTestimony];

// Pick a random strategy, optionally filtered by max difficulty (1=easy, 3=hard).
export function pickStrategy({ maxDifficulty } = {}) {
  const pool = maxDifficulty
    ? STRATEGIES.filter(s => s.difficulty <= maxDifficulty)
    : STRATEGIES;
  return rand(pool);
}

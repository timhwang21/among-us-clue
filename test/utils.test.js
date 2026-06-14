import { describe, it, expect } from 'vitest';
import { rand, shuffle } from '../src/utils.js';

describe('shuffle', () => {
  it('returns a new array', () => {
    const arr = [1, 2, 3];
    expect(shuffle(arr)).not.toBe(arr);
  });

  it('preserves all elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual([...arr].sort());
  });

  it('does not mutate the original', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles single element', () => {
    expect(shuffle([42])).toEqual([42]);
  });
});

describe('rand', () => {
  it('always returns an element from the array', () => {
    const arr = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(rand(arr));
    }
  });

  it('returns the only element for a singleton', () => {
    expect(rand(['only'])).toBe('only');
  });
});

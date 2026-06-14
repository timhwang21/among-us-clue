import { describe, it, expect } from 'vitest';
import { rand, shuffle, deconflictConsecutive } from '../src/utils.js';

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
  it('returns an element from the array', () => {
    expect(['a', 'b', 'c', 'd']).toContain(rand(['a', 'b', 'c', 'd']));
  });

  it('returns the only element for a singleton', () => {
    expect(rand(['only'])).toBe('only');
  });
});

const k = name => ({ name });

describe('deconflictConsecutive', () => {
  const key = item => item.name;

  it('no-op on already valid sequence', () => {
    const arr = [k('A'), k('B'), k('C'), k('A')];
    const result = deconflictConsecutive(arr, key);
    expect(result).toHaveLength(arr.length);
    for (let i = 0; i < result.length - 1; i++)
      expect(result[i].name).not.toBe(result[i + 1].name);
  });

  it('resolves simple consecutive duplicate', () => {
    const arr = [k('A'), k('A'), k('B'), k('C')];
    const result = deconflictConsecutive(arr, key);
    for (let i = 0; i < result.length - 1; i++)
      expect(result[i].name).not.toBe(result[i + 1].name);
  });

  it('resolves duplicates near the end of the array', () => {
    const arr = [k('A'), k('B'), k('A'), k('B'), k('A')];
    const result = deconflictConsecutive(arr, key);
    for (let i = 0; i < result.length - 1; i++)
      expect(result[i].name).not.toBe(result[i + 1].name);
  });

  it('handles majority speaker (A appears 3 of 5)', () => {
    const arr = [k('A'), k('A'), k('A'), k('B'), k('C')];
    const result = deconflictConsecutive(arr, key);
    for (let i = 0; i < result.length - 1; i++)
      expect(result[i].name).not.toBe(result[i + 1].name);
  });

  it('handles all-same speaker gracefully (impossible case, no crash)', () => {
    const arr = [k('A'), k('A'), k('A')];
    const result = deconflictConsecutive(arr, key);
    expect(result).toHaveLength(3);
    expect(result.every(x => x.name === 'A')).toBe(true);
  });

  it('preserves all original elements', () => {
    const arr = [k('A'), k('A'), k('B'), k('B'), k('C'), k('C')];
    const result = deconflictConsecutive(arr, key);
    expect(result).toHaveLength(arr.length);
    expect(result.map(x => x.name).sort()).toEqual(arr.map(x => x.name).sort());
  });

  it('handles single element', () => {
    expect(deconflictConsecutive([k('A')], key)).toEqual([k('A')]);
  });

  it('handles empty array', () => {
    expect(deconflictConsecutive([], key)).toEqual([]);
  });
});

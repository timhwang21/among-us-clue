export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Rearrange items so no two adjacent items share the same key (by keyFn).
// Uses greedy-max: always places the highest-remaining-count item that doesn't
// conflict with the previous. Produces a valid arrangement whenever one exists
// (i.e. max count ≤ ceil(n/2)). Falls back gracefully when impossible.
export function deconflictConsecutive(arr, keyFn) {
  const remaining = arr.slice();
  const result = [];
  while (remaining.length) {
    const lastKey = result.length ? keyFn(result[result.length - 1]) : null;
    const counts = new Map();
    for (const item of remaining) {
      const k = keyFn(item);
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    let bestIdx = -1, bestCount = -1;
    for (let i = 0; i < remaining.length; i++) {
      const k = keyFn(remaining[i]);
      if (k !== lastKey && counts.get(k) > bestCount) { bestCount = counts.get(k); bestIdx = i; }
    }
    if (bestIdx === -1) bestIdx = 0;
    result.push(remaining.splice(bestIdx, 1)[0]);
  }
  return result;
}

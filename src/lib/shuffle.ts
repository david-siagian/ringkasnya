/**
 * Utilitas pengacakan deterministik berbasis seed untuk katalog buku & artikel.
 */

export function getDailySeed(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function hashSeed(seed: string | number): number {
  const str = String(seed);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRng(seed: string | number): () => number {
  let state = hashSeed(seed) || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(
  items: readonly T[],
  seed: string | number
): T[] {
  const result = [...items];
  if (result.length <= 1) return result;

  const rng = createSeededRng(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createRandomSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function pickRandomItem<T>(
  items: readonly T[],
  isSameAsCurrent?: (item: T) => boolean
): T | undefined {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];

  const candidates = isSameAsCurrent
    ? items.filter((item) => !isSameAsCurrent(item))
    : items;
  const pool = candidates.length > 0 ? candidates : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

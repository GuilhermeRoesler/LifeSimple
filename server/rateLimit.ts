import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const RATE_WINDOW_MS = 60_000;
export const RATE_MAX = 20;

const STORE_DIR = join(process.cwd(), '.data');
const STORE_PATH = join(STORE_DIR, 'rate-limit.json');

type StoreFile = Record<string, number[]>;

let buckets = new Map<string, number[]>();
let loaded = false;
let dirty = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function prune(hits: number[], now: number): number[] {
  return hits.filter((t) => now - t < RATE_WINDOW_MS);
}

function loadFromDisk(): void {
  if (loaded) return;
  loaded = true;
  try {
    if (!existsSync(STORE_PATH)) return;
    const raw = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as StoreFile;
    const now = Date.now();
    for (const [key, hits] of Object.entries(raw)) {
      if (!Array.isArray(hits)) continue;
      const filtered = prune(
        hits.filter((t) => typeof t === 'number'),
        now
      );
      if (filtered.length > 0) buckets.set(key, filtered);
    }
  } catch {
    /* arquivo corrompido — começa limpo */
  }
}

function scheduleSave(): void {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (!dirty) return;
    dirty = false;
    try {
      mkdirSync(STORE_DIR, { recursive: true });
      const now = Date.now();
      const obj: StoreFile = {};
      for (const [key, hits] of buckets) {
        const filtered = prune(hits, now);
        if (filtered.length > 0) {
          obj[key] = filtered;
          buckets.set(key, filtered);
        } else {
          buckets.delete(key);
        }
      }
      writeFileSync(STORE_PATH, JSON.stringify(obj));
    } catch (error) {
      console.error('Falha ao persistir rate limit:', error);
    }
  }, 1_000);
}

/** Sliding window por chave (ip:/uid:). Persiste em `.data/rate-limit.json`. */
export function isRateLimited(key: string): boolean {
  loadFromDisk();
  const now = Date.now();
  const hits = prune(buckets.get(key) ?? [], now);
  if (hits.length >= RATE_MAX) {
    buckets.set(key, hits);
    scheduleSave();
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  scheduleSave();
  return false;
}

/** Só para testes. */
export function resetRateLimitForTests(): void {
  buckets = new Map();
  loaded = true;
  dirty = false;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}

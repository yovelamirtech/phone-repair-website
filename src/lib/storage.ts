/** Safe wrappers around localStorage / sessionStorage (they can throw in private mode). */

type StorageKind = 'local' | 'session';

function store(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string, fallback: T, kind: StorageKind = 'local'): T {
  try {
    const raw = store(kind)?.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown, kind: StorageKind = 'local'): void {
  try {
    store(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: ignore */
  }
}

export function removeItem(key: string, kind: StorageKind = 'local'): void {
  try {
    store(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storageKeys = {
  language: 'pixellab.lang',
  orderDraft: 'pixellab.orderDraft',
  orders: 'pixellab.orders',
  contactMessages: 'pixellab.contactMessages',
} as const;

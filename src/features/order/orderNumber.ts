export const ORDER_PREFIX = 'FX-';
const ORDER_RE = /^FX-\d{4}$/;

/** "FX-" followed by four digits. Avoids numbers already in use. */
export function generateOrderNumber(taken: Iterable<string> = [], random: () => number = Math.random): string {
  const used = new Set(taken);
  for (let i = 0; i < 1000; i++) {
    const n = 1000 + Math.floor(random() * 9000);
    const id = `${ORDER_PREFIX}${n}`;
    if (!used.has(id)) return id;
  }
  throw new Error('No free order number');
}

/** Accepts "fx-1024", "FX 1024" or "1024" and returns "FX-1024", or null if it can't be an order number. */
export function normalizeOrderNumber(input: string): string | null {
  const digits = input.trim().toUpperCase().replace(/^FX[\s-]?/, '');
  const id = `${ORDER_PREFIX}${digits}`;
  return ORDER_RE.test(id) ? id : null;
}

export const isOrderNumber = (s: string) => ORDER_RE.test(s);

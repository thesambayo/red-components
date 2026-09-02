/**
 * Process-wide counter. Because `@red-elements/core` resolves to a single
 * instance, IDs stay unique across every component package - the previous
 * per-package counters could collide once two packages used the same prefix.
 */
let counter = 0;

/**
 * Generates a unique DOM id for wiring `aria-labelledby` / `aria-describedby`
 * / `aria-controls`.
 *
 * @example
 * generateId("dialog-title") // "dialog-title-1"
 */
export function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

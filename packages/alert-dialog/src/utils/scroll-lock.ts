/**
 * ScrollLock - Manages body scroll locking with reference counting
 * Supports nested dialogs by tracking lock count
 */

let lockCount = 0;
let originalStyles: {
  overflow: string;
  paddingRight: string;
} | null = null;

/**
 * Get the width of the scrollbar
 */
function getScrollbarWidth(): number {
  // Create a temporary div to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.remove();

  return scrollbarWidth;
}

/**
 * Check if body has scrollbar
 */
function hasScrollbar(): boolean {
  return document.body.scrollHeight > window.innerHeight;
}

/**
 * Lock body scroll
 */
export function lockScroll(): void {
  lockCount++;

  // Only apply styles on first lock
  if (lockCount === 1) {
    const scrollbarWidth = hasScrollbar() ? getScrollbarWidth() : 0;

    // Store original styles
    originalStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    // Apply lock styles
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
  lockCount--;

  // Only restore styles when all locks are released
  if (lockCount === 0 && originalStyles) {
    document.body.style.overflow = originalStyles.overflow;
    document.body.style.paddingRight = originalStyles.paddingRight;
    originalStyles = null;
  }

  // Safety: prevent negative count
  if (lockCount < 0) {
    lockCount = 0;
  }
}

/**
 * Check if scroll is currently locked
 */
export function isScrollLocked(): boolean {
  return lockCount > 0;
}

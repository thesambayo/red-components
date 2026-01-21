/**
 * Selectors for focusable elements
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * FocusTrap - Traps focus within a container element
 */
export class FocusTrap {
  private container: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private observer: MutationObserver | null = null;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Get all focusable elements within the container
   */
  getFocusableElements(): HTMLElement[] {
    const elements = Array.from(
      this.container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );

    // Filter out elements that are not visible or have display: none
    return elements.filter((el) => {
      // Check if element is visible
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }
      // Check if element has dimensions
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    });
  }

  /**
   * Activate the focus trap
   */
  activate(initialFocusElement?: HTMLElement | null): void {
    // Store currently focused element
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Add keyboard listener
    document.addEventListener('keydown', this.boundHandleKeyDown);

    // Set up mutation observer for dynamic content
    this.observer = new MutationObserver(() => {
      // Re-check focusable elements when DOM changes
    });

    this.observer.observe(this.container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'hidden'],
    });

    // Focus initial element or first focusable
    requestAnimationFrame(() => {
      if (initialFocusElement && this.container.contains(initialFocusElement)) {
        initialFocusElement.focus();
      } else {
        const focusables = this.getFocusableElements();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          // If no focusable elements, make container focusable
          this.container.setAttribute('tabindex', '-1');
          this.container.focus();
        }
      }
    });
  }

  /**
   * Deactivate the focus trap
   */
  deactivate(): void {
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Restore focus to previously focused element
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      requestAnimationFrame(() => {
        this.previouslyFocused?.focus();
      });
    }
  }

  /**
   * Handle Tab key to trap focus
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) return;

    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    const activeElement = document.activeElement;

    // Shift + Tab
    if (event.shiftKey) {
      if (activeElement === firstFocusable || !this.container.contains(activeElement)) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (activeElement === lastFocusable || !this.container.contains(activeElement)) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }
}

/**
 * Cleanup returned by a behavior's setup function.
 */
export type BehaviorCleanup = () => void;

/**
 * Wires behavior onto light-DOM descendants matching `selector`, and keeps
 * doing so as the DOM changes.
 *
 * This backs the attribute escape hatch - `<button data-dialog-trigger>` - for
 * cases where you need to bring your own element or tag. Unlike `as-child`, it
 * does not reach through a slot and mutate whatever it finds: the consumer
 * marks exactly one element, explicitly, and can see it in their own markup.
 *
 * It also replaces the previous one-shot `querySelectorAll` wiring in
 * `dialog-root`, which ran once inside a `requestAnimationFrame`, never saw
 * elements added later, and never removed its listeners.
 *
 * @param root      Element whose subtree is watched.
 * @param selector  Selector for elements that should receive the behavior.
 * @param setup     Called once per matched element; return a cleanup function.
 * @returns Disposer that tears down every attached behavior and the observer.
 *
 * @example
 * this._disposeClose = attachBehavior(this, "[data-dialog-close]", (el) => {
 *   const onClick = () => this._handleOpenChange(false);
 *   el.addEventListener("click", onClick);
 *   return () => el.removeEventListener("click", onClick);
 * });
 */
export function attachBehavior(
  root: HTMLElement,
  selector: string,
  setup: (element: HTMLElement) => BehaviorCleanup | void
): BehaviorCleanup {
  const attached = new Map<HTMLElement, BehaviorCleanup>();

  const sync = () => {
    const matches = new Set<HTMLElement>(
      Array.from(root.querySelectorAll<HTMLElement>(selector))
    );

    // Detach behavior from elements that are gone or no longer match.
    for (const [element, cleanup] of attached) {
      if (!matches.has(element)) {
        cleanup();
        attached.delete(element);
      }
    }

    // Attach to newly matching elements.
    for (const element of matches) {
      if (attached.has(element)) continue;
      const cleanup = setup(element);
      attached.set(element, cleanup ?? (() => {}));
    }
  };

  sync();

  // `attributes` is watched too: the selector is attribute-based, so toggling
  // `data-dialog-close` must attach or detach behavior just like adding or
  // removing the element.
  const observer = new MutationObserver(sync);
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  return () => {
    observer.disconnect();
    for (const cleanup of attached.values()) cleanup();
    attached.clear();
  };
}

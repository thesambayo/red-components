import type { BehaviorCleanup } from "./attach-behavior";

/**
 * How an activation was produced.
 *
 * Worth passing on: a menu opened from the keyboard should move focus onto its
 * first item, while the same menu opened by mouse should not - an unrequested
 * focus ring on click is the tell that a component ignores this distinction.
 */
export type ActivationSource = "pointer" | "keyboard";

export interface PopoverToggleOptions {
  /** Whether the popover is open *right now*. */
  isOpen: () => boolean;
  open: (source: ActivationSource) => void;
  close: (source: ActivationSource) => void;
  /** Return true to ignore the activation entirely (e.g. disabled trigger). */
  shouldIgnore?: (event: Event) => boolean;
}

/**
 * Wires an element to toggle a `popover="auto"` element, without fighting the
 * browser's light dismiss.
 *
 * ## The bug this exists to fix
 *
 * A `popover="auto"` light-dismisses when a pointer gesture lands outside it -
 * *unless* the target is its registered invoker. Only `<button>` and `<input>`
 * can be invokers (`popoverTargetElement` is defined on those two interfaces
 * only), so a custom-element trigger like `<dropdown-trigger>` can never
 * register as one.
 *
 * That produced a close/reopen blink on every trigger click while open:
 *
 *   pointerup  -> browser light-dismisses the popover
 *   click      -> handler reads "closed", so it opens it again
 *
 * The menu appeared to blink and could never be closed from its own trigger.
 *
 * ## The fix
 *
 * Decide the toggle direction from the state at *pointerdown* - before light
 * dismiss has run - rather than from the state at click time. A click that
 * began while the popover was open therefore closes it (a no-op, since the
 * browser already did), instead of reopening it.
 *
 * Keyboard activation has no preceding `pointerdown`, so the recorded state is
 * cleared on `keydown` and the handler falls back to the live state.
 *
 * @example
 * this._dispose = attachPopoverToggle(this, {
 *   isOpen: () => this._context.isOpen,
 *   open: () => this._context.onOpen(),
 *   close: () => this._context.onClose(),
 * });
 */
export function attachPopoverToggle(
  element: HTMLElement,
  options: PopoverToggleOptions
): BehaviorCleanup {
  /** Open state captured at pointerdown; null when the gesture was keyboard. */
  let openAtPointerDown: boolean | null = null;

  const onPointerDown = () => {
    openAtPointerDown = options.isOpen();
  };

  // A keyboard activation produces a click with no preceding pointerdown, so a
  // stale reading from an abandoned pointer gesture (press, drag off, release)
  // must not decide it.
  const onKeyDown = () => {
    openAtPointerDown = null;
  };

  const onClick = (event: Event) => {
    // A recorded pointerdown is also what identifies the gesture: a keyboard
    // activation reaches `click` without one.
    const source: ActivationSource =
      openAtPointerDown !== null ? "pointer" : "keyboard";
    const wasOpen = openAtPointerDown ?? options.isOpen();
    openAtPointerDown = null;

    if (options.shouldIgnore?.(event)) return;

    if (wasOpen) options.close(source);
    else options.open(source);
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("click", onClick);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("keydown", onKeyDown);
    element.removeEventListener("click", onClick);
  };
}

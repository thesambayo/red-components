import type { BehaviorCleanup } from "./attach-behavior";

export interface DismissOptions {
  /**
   * Elements that count as "inside" in addition to the popover itself - the
   * anchor, the trigger, the input. A pointer gesture landing on any of these
   * must not dismiss.
   *
   * Read lazily, on each gesture, because these references are registered
   * asynchronously as children upgrade.
   */
  boundary?: () => (Element | null | undefined)[];
  /** Also dismiss on Escape. Defaults to true. */
  escape?: boolean;
  onDismiss: () => void;
}

/**
 * Light dismiss for a `popover="manual"` element.
 *
 * ## Why not just use `popover="auto"`
 *
 * `auto` gives light dismiss for free, but its notion of "inside" is only the
 * popover plus its registered invoker - and only `<button>` / `<input>` can be
 * invokers. A combobox's text input sits *outside* its listbox popover, so with
 * `auto` every click into the input to reposition the caret dismissed the list,
 * which the input's own click handler then reopened. The list blinked on every
 * click and the caret never landed where the user aimed.
 *
 * `manual` plus this helper lets the component name its own boundary, so the
 * input, anchor, and trigger are all treated as inside.
 *
 * Attach on open, dispose on close.
 *
 * @example
 * this._disposeDismiss = attachDismiss(this, {
 *   boundary: () => [this._context.inputElement, this._context.triggerElement],
 *   onDismiss: () => this._context.onClose(),
 * });
 */
export function attachDismiss(
  popover: HTMLElement,
  options: DismissOptions
): BehaviorCleanup {
  const isInside = (event: Event): boolean => {
    // `composedPath` rather than `contains`: the gesture may originate inside a
    // shadow root, where `event.target` is retargeted to the host and
    // `contains` would answer about the wrong element.
    const path = event.composedPath();
    if (path.includes(popover)) return true;

    for (const element of options.boundary?.() ?? []) {
      if (element && path.includes(element)) return true;
    }
    return false;
  };

  const onPointerDown = (event: Event) => {
    if (isInside(event)) return;
    options.onDismiss();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    // A `popover="auto"` closing on Escape consumes the key, so only the
    // innermost layer reacts. Reproduce that here, or a combobox inside a
    // dialog would close both at once.
    event.preventDefault();
    event.stopPropagation();
    options.onDismiss();
  };

  // Capture phase, so a consumer calling `stopPropagation()` on their own
  // content cannot strand the popover open.
  document.addEventListener("pointerdown", onPointerDown, true);
  if (options.escape !== false) {
    document.addEventListener("keydown", onKeyDown, true);
  }

  return () => {
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("keydown", onKeyDown, true);
  };
}

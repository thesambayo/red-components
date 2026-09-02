import type { TooltipRootContextValue } from "./types";

/**
 * Tooltip trigger behavior, shared by `<tooltip-trigger>` and the
 * `data-tooltip-trigger` escape hatch.
 *
 * Extracted rather than reimplemented per path: the rules here are subtle
 * (ignore touch pointers, suppress the focus-open that follows a click, only
 * open on keyboard focus, defer close when content is hoverable) and two copies
 * would drift apart - which is the failure this refactor exists to remove.
 *
 * @param element     The element that acts as the trigger.
 * @param getContext  Reads the current root context (it changes over time).
 * @returns Cleanup that removes every listener.
 */
export function attachTooltipTriggerBehavior(
  element: HTMLElement,
  getContext: () => TooltipRootContextValue | undefined
): () => void {
  /** Suppresses the focus that immediately follows a pointer press. */
  let isPointerDown = false;

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    getContext()?.onOpen();
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const context = getContext();
    // When the content is hoverable, close on a delay so the pointer can
    // travel from the trigger to the content without dismissing it.
    context?.onClose(context.disableHoverableContent ?? true);
  };

  const onPointerDown = () => {
    isPointerDown = true;
    getContext()?.onClose(true);
    setTimeout(() => {
      isPointerDown = false;
    }, 0);
  };

  const onFocus = (event: FocusEvent) => {
    if (isPointerDown) return;
    const target = event.target as HTMLElement;
    try {
      // Keyboard focus only; a click should not leave a tooltip open.
      if (!target.matches(":focus-visible")) return;
    } catch {
      // :focus-visible unsupported - fall through and open on any focus.
    }
    getContext()?.onOpen();
  };

  const onBlur = () => getContext()?.onClose(true);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") getContext()?.onClose(true);
  };

  const onClick = () => getContext()?.onClose(true);

  element.addEventListener("pointerenter", onPointerEnter);
  element.addEventListener("pointerleave", onPointerLeave);
  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("focus", onFocus);
  element.addEventListener("blur", onBlur);
  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("click", onClick);

  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "0");
  }

  return () => {
    element.removeEventListener("pointerenter", onPointerEnter);
    element.removeEventListener("pointerleave", onPointerLeave);
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("focus", onFocus);
    element.removeEventListener("blur", onBlur);
    element.removeEventListener("keydown", onKeyDown);
    element.removeEventListener("click", onClick);
  };
}

/**
 * Reflects open state onto a trigger element. Shared for the same reason.
 */
export function updateTooltipTriggerAttributes(
  element: HTMLElement,
  context: TooltipRootContextValue | undefined
): void {
  if (!context) return;

  if (context.open) {
    element.setAttribute("aria-describedby", context.contentId);
  } else {
    element.removeAttribute("aria-describedby");
  }
  element.setAttribute("data-state", context.stateAttribute);
}

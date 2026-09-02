/**
 * Event naming convention: `{component}:{kebab-case-event}`.
 *
 * Namespacing matters for more than tidiness - an un-namespaced bubbling
 * `change` from a component is indistinguishable from a native form `change`
 * at any ancestor listener, which is a real source of bugs for consumers.
 *
 * The namespace is enforced by the type system rather than a runtime check, so
 * it costs nothing in the shipped bundle and fails at compile time instead.
 */
export type NamespacedEventName = `${string}:${string}`;

/**
 * Dispatches a bubbling, composed CustomEvent.
 *
 * `composed` is required so the event escapes the shadow boundary of the
 * component that raised it; `bubbles` so consumers can listen on an ancestor
 * rather than on the exact element.
 *
 * @returns false when a listener called `preventDefault()`.
 */
export function dispatch<T>(
  target: EventTarget,
  name: NamespacedEventName,
  detail?: T,
  options?: { cancelable?: boolean }
): boolean {
  return target.dispatchEvent(
    new CustomEvent(name, {
      bubbles: true,
      composed: true,
      cancelable: options?.cancelable ?? false,
      detail,
    })
  );
}

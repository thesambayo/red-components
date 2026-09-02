import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * `ReactiveControllerHost.requestUpdate()` is declared with no parameters; the
 * `(name, oldValue)` overload lives on `ReactiveElement`. Widening here keeps
 * the controller usable by any host without depending on `ReactiveElement`.
 */
type UpdatingHost = ReactiveControllerHost & {
  requestUpdate(name?: PropertyKey, oldValue?: unknown): void;
};

export interface ControlledStateOptions<T> {
  /**
   * Reads the controlled property. Returning `undefined` means the consumer is
   * not controlling this value and internal state is used instead.
   *
   * Omit entirely for components that expose no controlled property (accordion
   * and tabs are uncontrolled-only today) - they still get late-default
   * initialization from this controller.
   */
  prop?: () => T | undefined;
  /** Reads the uncontrolled initial value (the `default-*` property). */
  defaultValue: () => T | undefined;
  /** Used when neither a controlled prop nor a default is supplied. */
  fallback: T;
  /**
   * Equality test, default `Object.is`.
   *
   * Needed for non-primitive values: an array default is a fresh reference
   * every read, so identity comparison would latch initialization on the first
   * update and permanently ignore a real default arriving later from React.
   */
  equals?: (a: T, b: T) => boolean;
  /**
   * Optional reactive-property name reported to Lit on change.
   *
   * When supplied, `set()` calls `host.requestUpdate(name, previous)` so the
   * value appears in `changedProperties` and existing
   * `changed.has("_internalOpen")` style checks keep working. Without it the
   * controller requests a generic update, and any `willUpdate` logic keyed on
   * that name silently stops running - which is exactly how converting
   * `dialog-root` first broke it.
   *
   * Prefer deriving from `value` in `willUpdate` where practical; this exists so
   * existing roots can migrate without rewriting their update logic.
   */
  name?: PropertyKey;
}

/**
 * Controlled / uncontrolled state, as a reactive controller.
 *
 * Replaces the `_isControlled` / `_hasInitialized` / `willUpdate` blocks that
 * were hand-written in every root. Those blocks relied on a manually maintained
 * list of `changed.has(...)` keys; forgetting to add a key silently broke the
 * property (see the `openOnFocus` / `openOnClick` bug in combobox).
 *
 * ## Late initialization
 *
 * React - and therefore `@lit/react` - assigns properties *after* the element
 * is connected, so `defaultValue` is usually not readable in
 * `connectedCallback`. This controller reads it on each host update until it
 * resolves, which is why `tabs`, `select`, and `switch` each grew their own
 * `_hasInitialized` flag (and why `dialog`, which lacked one, ignored
 * `defaultOpen` under React).
 *
 * @example
 * private _open = new ControlledState<boolean>(this, {
 *   prop: () => this.open,
 *   defaultValue: () => this.defaultOpen,
 *   fallback: false,
 * });
 *
 * // read
 * this._open.value
 * // write (no-op while controlled - the consumer owns the value)
 * this._open.set(true)
 */
export class ControlledState<T> implements ReactiveController {
  private _host: UpdatingHost;
  private _options: ControlledStateOptions<T>;
  private _internal: T;
  private _initialized = false;
  /**
   * A latch made in `hostUpdate` that still has to be announced in
   * `hostUpdated`. Boxed rather than a bare `T`, so that a legitimate
   * `undefined` previous value is distinguishable from "nothing pending".
   */
  private _pendingAnnouncement?: { previous: T };

  constructor(host: UpdatingHost, options: ControlledStateOptions<T>) {
    this._host = host;
    this._options = options;
    this._internal = options.fallback;
    host.addController(this);
  }

  /**
   * True once a default has been applied or the value has been set at least
   * once - i.e. the value is no longer "untouched". Useful for behavior that
   * should only happen before any value exists, such as auto-selecting a lone
   * option.
   */
  get isInitialized(): boolean {
    return this._initialized;
  }

  /** True when the consumer supplies the value via the controlled property. */
  get isControlled(): boolean {
    return this._options.prop?.() !== undefined;
  }

  /** The effective value: the controlled prop if present, else internal state. */
  get value(): T {
    const prop = this._options.prop?.();
    return prop !== undefined ? prop : this._internal;
  }

  /**
   * Updates internal state.
   *
   * In controlled mode this is deliberately a no-op: the consumer owns the
   * value and is expected to react to the change event. Callers should emit
   * their change event regardless of the return value.
   *
   * @returns true when internal state actually changed.
   */
  set(value: T): boolean {
    // Once the consumer has interacted, a `default-*` arriving late must not
    // clobber their value.
    this._initialized = true;

    if (this.isControlled) return false;
    if (this._equals(this._internal, value)) return false;

    const previous = this._internal;
    this._internal = value;
    this._requestUpdate(previous);
    return true;
  }

  /**
   * Restores the default value. Used by `formResetCallback`, which must reset
   * even while controlled - the form, not the consumer, owns a reset.
   */
  reset(): T {
    const next = this._options.defaultValue() ?? this._options.fallback;
    const previous = this._internal;
    this._internal = next;
    this._initialized = true;
    this._requestUpdate(previous);
    return next;
  }

  /**
   * Forces internal state, ignoring controlled mode. For
   * `formStateRestoreCallback`, where the browser restores a value directly.
   */
  restore(value: T): void {
    const previous = this._internal;
    this._internal = value;
    this._initialized = true;
    this._requestUpdate(previous);
  }

  private _equals(a: T, b: T): boolean {
    return (this._options.equals ?? Object.is)(a, b);
  }

  private _requestUpdate(previous: T): void {
    if (this._options.name !== undefined) {
      this._host.requestUpdate(this._options.name, previous);
    } else {
      this._host.requestUpdate();
    }
  }

  hostUpdate(): void {
    if (this._initialized) return;

    const initial = this._options.defaultValue();
    if (initial === undefined) return;

    // A boolean `default-*` property declared as `= false` is indistinguishable
    // from "not set yet", so latching on it would make a late `true` from React
    // a no-op. Staying unlatched while the default still equals the fallback
    // costs nothing - internal state already holds that value - and leaves the
    // door open for the real default to arrive. This is the generalized form of
    // the `if (!this._hasInitialized && this.defaultChecked)` guard that switch,
    // tabs, and select each wrote by hand.
    if (this._equals(initial, this._internal)) return;

    // Latch now, so `update()` and `render()` in THIS cycle already see the
    // real default - the value is visibly correct on first paint.
    const previous = this._internal;
    this._internal = initial;
    this._initialized = true;

    // But do not announce it yet. See `hostUpdated`.
    this._pendingAnnouncement = { previous };
  }

  /**
   * Announces a latch made during `hostUpdate`, one cycle late and deliberately.
   *
   * ## Why this cannot be done in `hostUpdate`
   *
   * Lit 3 runs controller hooks *after* `willUpdate`, not before
   * (`@lit/reactive-element` `performUpdate`):
   *
   * ```js
   * this.willUpdate(changedProperties);                    // first
   * this.__controllers?.forEach((c) => c.hostUpdate?.());  // then
   * this.update(changedProperties);
   * ```
   *
   * So calling `requestUpdate(name, previous)` from `hostUpdate` is doubly
   * useless: `willUpdate` has already run and never saw the key, and the change
   * is recorded into a `changedProperties` map that `update()` is about to throw
   * away via `__markUpdated()`. No follow-up update is scheduled either, because
   * `_$changeProperty` only enqueues one when `isUpdatePending === false` - and
   * mid-cycle it is still `true`.
   *
   * The net effect was silent: a `default-value` latched correctly into internal
   * state, rendered correctly, and yet every `willUpdate` block keyed on
   * `changed.has("_value")` was skipped for it. That is how `default-value` and
   * `default-checked` reached the screen but never reached
   * `ElementInternals.setFormValue`, so the form submitted empty until the user
   * changed something by hand.
   *
   * `hostUpdated` runs inside `_$didUpdate`, after `__markUpdated()` has set
   * `isUpdatePending = false`, so a `requestUpdate` from here enqueues a real
   * second cycle whose `willUpdate` does receive the key. It costs one extra
   * update per element, once, gated by `_initialized`.
   *
   * The broader lesson, and why `dialog-root` was never affected: deriving from
   * the effective value (comparing against a `_lastSynced` field) is robust,
   * while `changedProperties.has(...)` is a trap for any state a controller owns.
   */
  hostUpdated(): void {
    const pending = this._pendingAnnouncement;
    if (pending === undefined) return;
    this._pendingAnnouncement = undefined;
    this._requestUpdate(pending.previous);
  }
}

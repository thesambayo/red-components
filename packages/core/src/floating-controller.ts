import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  autoUpdate,
  computePosition,
  type Middleware,
  type Placement,
} from "@floating-ui/dom";

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

export interface FloatingControllerOptions {
  /** Middleware for this component. Read fresh on every reposition. */
  middleware: () => Middleware[];
  /** Desired placement, derived from the component's `side` / `align`. */
  placement: () => Placement;
  /** Defaults to "fixed", which is what a top-layer popover needs. */
  strategy?: "fixed" | "absolute";
  /** Called after each successful reposition, for component-specific work. */
  onPositioned?: (result: {
    x: number;
    y: number;
    placement: Placement;
    middlewareData: Record<string, any>;
  }) => void;
}

/**
 * Positions a floating element against an anchor and *keeps it there*.
 *
 * The important part is `autoUpdate`. `computePosition` is a one-shot
 * calculation: select, dropdown, and tooltip each called it once when opening,
 * so their content visibly detached from the trigger on scroll or resize.
 * Only combobox started an `autoUpdate` loop. This controller makes the
 * combobox behavior the default for all of them.
 *
 * `autoUpdate` watches scroll ancestors, resize, and layout shifts, and returns
 * a cleanup function that MUST run on close - otherwise the observers leak for
 * the lifetime of the page.
 *
 * ## Why the host is hidden until the first position lands
 *
 * `showPopover()` makes the element visible synchronously, but `computePosition`
 * is async. Worse, a `size()` middleware whose `apply` writes CSS custom
 * properties changes the floating element's own box, which invalidates the
 * `flip()` / `shift()` decisions that were computed against the *pre-resize*
 * box - and then trips `autoUpdate`'s ResizeObserver, producing a second,
 * visibly different position a frame later.
 *
 * So the host is hidden until two settle passes have run. Combobox previously
 * hand-rolled this with a `data-state="opening"` rule; dropdown, select, and
 * tooltip had nothing, which is where their open-flicker came from.
 *
 * The gate is the `data-floating-hidden` attribute rather than an inline
 * style, for two reasons: `showPopover()` reveals the element synchronously
 * while its `toggle` event - where `start()` is called from - is queued as a
 * task, so the gate has to be settable earlier via `gate()` from a synchronous
 * `beforetoggle`; and tooltip drives inline `visibility` itself for
 * `hide({ strategy: "referenceHidden" })`, which a blanket inline reset here
 * would stomp. Each content pairs it with:
 *
 *   :host([data-floating-hidden]) { visibility: hidden; }
 *
 * @example
 * private _floating = new FloatingController(this, {
 *   placement: () => `${this.side}-${this.align}` as Placement,
 *   middleware: () => [offset(this.sideOffset), flip(), shift({ padding: 8 })],
 * });
 *
 * // on open
 * this._floating.start(triggerElement);
 * // on close
 * this._floating.stop();
 */
export class FloatingController implements ReactiveController {
  private _host: ReactiveControllerHost & HTMLElement;
  private _options: FloatingControllerOptions;
  private _cleanup?: () => void;
  private _anchor: Element | null = null;
  /** False until the first position has been applied and the host revealed. */
  private _positioned = false;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options: FloatingControllerOptions
  ) {
    this._host = host;
    this._options = options;
    host.addController(this);
  }

  /** Whether the controller is currently tracking an anchor. */
  get isActive(): boolean {
    return this._cleanup !== undefined;
  }

  /**
   * Begins tracking `anchor`. Safe to call repeatedly; a previous loop is torn
   * down first so observers cannot accumulate.
   *
   * The host is hidden until the first position is applied - see the class
   * comment. Callers do not need their own "opening" state for this.
   */
  start(anchor: Element): void {
    this.stop();
    this._anchor = anchor;
    this._positioned = false;
    this.gate();

    this._cleanup = autoUpdate(anchor, this._host, () => {
      void this._settle();
    });
  }

  /**
   * Hides the host until the next successful reposition.
   *
   * Call this synchronously from `beforetoggle` - before the browser paints
   * the popover - since the `toggle` event that drives `start()` is queued as
   * a task and can arrive a frame too late. Idempotent.
   */
  gate(): void {
    this._positioned = false;
    // `visibility` (via the paired CSS rule) rather than `opacity` or
    // `display`: it keeps the element laid out, so `size()` can still measure
    // it, while guaranteeing nothing paints at the coordinates left over from
    // the previous open.
    this._host.setAttribute("data-floating-hidden", "");
  }

  /** Stops tracking and releases the observers. */
  stop(): void {
    this._cleanup?.();
    this._cleanup = undefined;
    this._anchor = null;
    this._positioned = false;

    // Clear the coordinates as well as the gate. Leaving them behind meant the
    // next open painted one frame at the *previous* open's position before
    // jumping - the "it jumps if I scrolled between opens" bug.
    this._host.style.left = "";
    this._host.style.top = "";
    this._host.removeAttribute("data-floating-hidden");
  }

  /**
   * Runs the update loop for one `autoUpdate` tick, then reveals the host on
   * the first tick.
   */
  private async _settle(): Promise<void> {
    try {
      await this.update();

      if (this._positioned || !this._anchor) return;

      // Second pass: the first one may have resized the host via `size()`,
      // which makes its flip/shift decisions stale. `computePosition` resolves
      // in microtasks, so both passes land in the same frame - this costs no
      // perceptible latency on open.
      await this.update();
      if (!this._anchor) return;

      this._positioned = true;
      this._host.removeAttribute("data-floating-hidden");
    } catch (error) {
      // A failed measurement must not leave the gate down: an unpositioned
      // popover is recoverable, a permanently invisible one is not.
      this._positioned = true;
      this._host.removeAttribute("data-floating-hidden");
      throw error;
    }
  }

  /** Repositions once. Called by the autoUpdate loop; rarely needed directly. */
  async update(): Promise<void> {
    if (!this._anchor) return;

    const anchor = this._anchor;
    const { x, y, placement, middlewareData } = await computePosition(
      anchor,
      this._host,
      {
        strategy: this._options.strategy ?? "fixed",
        placement: this._options.placement(),
        middleware: this._options.middleware(),
      }
    );

    // The element may have been closed - or re-anchored to something else -
    // while `computePosition` awaited. Writing here would resurrect a stale
    // position on top of a newer one.
    if (this._anchor !== anchor) return;

    Object.assign(this._host.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    const [side, align = "center"] = placement.split("-");
    this._host.setAttribute("data-side", side);
    this._host.setAttribute("data-align", align);

    this._options.onPositioned?.({ x, y, placement, middlewareData });
  }

  /** Releases observers if the element is removed while open. */
  hostDisconnected(): void {
    this.stop();
  }
}

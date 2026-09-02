import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SwitchContext, switchContext, SWITCH_EVENTS } from "./switch-context";
import { ControlledState, dispatch } from "@red-elements/core";

@customElement("switch-root")
export class SwitchRoot extends LitElement {
  static formAssociated = true;

  private _internals: ElementInternals;

  @property({ type: String })
  name?: string;

  @property({ type: String })
  value = "on";

  @property({ type: Boolean, attribute: "default-checked" })
  defaultChecked = false;

  /**
   * Controlled checked state. **JS-only** - this has no HTML attribute.
   *
   * An absent boolean/string attribute is indistinguishable from one set to a
   * falsy value, so there would be no way to tell "not controlled" from
   * "controlled and currently false". Setting the property to `undefined`
   * means uncontrolled; any other value means the consumer owns it.
   *
   * From plain HTML use `default-checked` and listen for the change event.
   */
  @property({ type: Boolean, attribute: false })
  checked?: boolean;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  required = false;

  /**
   * Controlled/uncontrolled checked state, including the late-`defaultChecked`
   * initialization React needs. `name` keeps it visible in `changedProperties`
   * so the `willUpdate` block below is unaffected.
   */
  private _checkedState = new ControlledState<boolean>(this, {
    prop: () => this.checked,
    defaultValue: () => this.defaultChecked,
    fallback: false,
    name: "_checked",
  });

  @provide({ context: switchContext })
  @property({ attribute: false })
  context: SwitchContext = this._createContext();

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "switch");
    }
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    this._updateFormValue();
    this._updateAriaAttributes();
    this._updateDataAttributes();
    this._updateContext();

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (
      changed.has("_checked") ||
      changed.has("checked") ||
      changed.has("disabled") ||
      changed.has("readonly") ||
      changed.has("required") ||
      changed.has("value")
    ) {
      this._updateFormValue();
      this._updateAriaAttributes();
      this._updateDataAttributes();
      this._updateContext();
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  // -- Controlled / Uncontrolled --

  private get _effectiveChecked(): boolean {
    return this._checkedState.value;
  }

  // -- Toggle --

  private _toggle() {
    if (this.disabled || this.readonly) return;

    const newChecked = !this._effectiveChecked;

    this._checkedState.set(newChecked);

    dispatch(this, SWITCH_EVENTS.CHECKED_CHANGE, { checked: newChecked });
  }

  // -- Event handlers --

  private _handleClick = () => {
    this._toggle();
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this._toggle();
    }
  };

  // -- Context --

  private _createContext(): SwitchContext {
    return {
      checked: this._effectiveChecked,
      disabled: this.disabled,
      readonly: this.readonly,
      required: this.required,
    };
  }

  private _updateContext() {
    this.context = this._createContext();
  }

  // -- ARIA --

  private _updateAriaAttributes() {
    this.setAttribute("aria-checked", String(this._effectiveChecked));

    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }

    if (this.readonly) {
      this.setAttribute("aria-readonly", "true");
    } else {
      this.removeAttribute("aria-readonly");
    }

    if (this.required) {
      this.setAttribute("aria-required", "true");
    } else {
      this.removeAttribute("aria-required");
    }
  }

  // -- Data attributes --

  private _updateDataAttributes() {
    const checked = this._effectiveChecked;

    if (checked) {
      this.dataset.checked = "";
      delete this.dataset.unchecked;
    } else {
      delete this.dataset.checked;
      this.dataset.unchecked = "";
    }

    if (this.disabled) {
      this.dataset.disabled = "";
    } else {
      delete this.dataset.disabled;
    }

    if (this.readonly) {
      this.dataset.readonly = "";
    } else {
      delete this.dataset.readonly;
    }

    if (this.required) {
      this.dataset.required = "";
    } else {
      delete this.dataset.required;
    }
  }

  // -- Form integration --

  private _updateFormValue() {
    if (this._effectiveChecked) {
      this._internals.setFormValue(this.value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  formResetCallback() {
    const restored = this._checkedState.reset();
    this._updateFormValue();
    this._updateAriaAttributes();
    this._updateDataAttributes();
    this._updateContext();

    dispatch(this, SWITCH_EVENTS.CHECKED_CHANGE, { checked: restored });
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: "restore" | "autocomplete"
  ) {
    if (typeof state === "string") {
      this._checkedState.restore(state === this.value);
    } else {
      this._checkedState.restore(false);
    }
    this._updateFormValue();
    this._updateAriaAttributes();
    this._updateDataAttributes();
    this._updateContext();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "switch-root": SwitchRoot;
  }
}

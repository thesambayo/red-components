import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  computePosition,
  autoUpdate,
  offset,
  shift,
  flip,
} from "@floating-ui/dom";

@customElement("dropdown-root")
export class Dropdown extends LitElement {
  static styles = css`
    .dropdown-trigger {
      padding: 8px 16px;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
    }

    .dropdown-menu {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: none;
    }

    .dropdown-menu.open {
      display: block;
    }
  `;

  @property({ attribute: "isOpen", type: Boolean })
  isOpen = false;

  @state()
  private _cleanup?: () => void;

  constructor() {
    super();
    this.isOpen = false;
    this._cleanup = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClickOutside);
    if (this._cleanup) this._cleanup();
  }

  _handleClickOutside(event: any) {
    if (!this.contains(event.target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this._positionDropdown();
    } else {
      if (this._cleanup) {
        this._cleanup();
      }
    }
  }

  closeDropdown() {
    this.isOpen = false;
    if (this._cleanup) this._cleanup();
  }

  private _positionDropdown() {
    const trigger = this.querySelector(".dropdown-trigger")! as HTMLElement;
    const menu = this.querySelector(".dropdown-menu")! as HTMLElement;

    this._cleanup = autoUpdate(trigger, menu, () => {
      computePosition(trigger, menu, {
        placement: "bottom-start",
        middleware: [offset(4), shift(), flip()],
      }).then(({ x, y }) => {
        Object.assign(menu.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  }

  render() {
    return html`
      <div class="dropdown">
        <button class="dropdown-trigger" @click=${this.toggleDropdown}>
          Select an option
        </button>
        <div class="dropdown-menu ${this.isOpen ? "open" : ""}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

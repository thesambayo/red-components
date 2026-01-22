import { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DIALOG_URL);

const meta = {
  title: "Primitives/Dialog",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: { type: "boolean" },
      type: "boolean",
      description: "Controlled open state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    modal: {
      control: { type: "boolean" },
      type: "boolean",
      description: "Whether dialog is modal (traps focus, has backdrop)",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    defaultOpen: {
      control: { type: "boolean" },
      type: "boolean",
      description: "Default open state for uncontrolled mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  args: {
    open: undefined,
    modal: true,
    defaultOpen: false,
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

/**
 * Basic dialog using native `<dialog>` element with backdrop styling.
 * Uses `data-dialog-title`, `data-dialog-description`, and `data-dialog-close` attributes.
 */
export const Basic: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .trigger-button:hover {
        background: #f5f5f5;
      }

      dialog {
        padding: 24px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
      }
      dialog .close-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
      dialog .close-button:hover {
        background: #2563eb;
      }
    </style>

    <dialog-root>
      <dialog-trigger as-child>
        <button class="trigger-button">Open Dialog</button>
      </dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Edit Profile</h2>
        <p class="description" data-dialog-description>
          Make changes to your profile here. Click save when you're done.
        </p>
        <p>Your profile content goes here...</p>
        <button class="close-button" data-dialog-close>Close</button>
      </dialog>
    </dialog-root>
  `,
};

/**
 * Dialog with as-child trigger and dialog-close component.
 */
export const WithCloseComponent: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .trigger-button:hover {
        background: #f5f5f5;
      }

      dialog {
        padding: 24px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
      }
      dialog .close-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
      dialog .close-button:hover {
        background: #2563eb;
      }
    </style>

    <dialog-root>
      <dialog-trigger as-child>
        <button class="trigger-button">Open Dialog</button>
      </dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Edit Profile</h2>
        <p class="description" data-dialog-description>
          This example uses dialog-close component instead of data-dialog-close
          attribute.
        </p>
        <dialog-close as-child>
          <button class="close-button">Close</button>
        </dialog-close>
      </dialog>
    </dialog-root>
  `,
};

/**
 * Controlled dialog where open state is managed externally.
 */
export const Controlled: Story = {
  render: (args) => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
        margin-right: 8px;
      }

      dialog {
        padding: 24px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
      }
      dialog .close-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
    </style>

    <dialog-root .open=${args.open}>
      <dialog-trigger as-child>
        <button class="trigger-button">Open Dialog</button>
      </dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Controlled Dialog</h2>
        <p class="description" data-dialog-description>
          This dialog's open state is controlled via the "open" prop.
        </p>
        <button class="close-button" data-dialog-close>Close</button>
      </dialog>
    </dialog-root>
  `,
  args: {
    open: false,
  },
};

/**
 * Non-modal dialog that doesn't trap focus or block interaction.
 * Uses native dialog's `show()` instead of `showModal()`.
 */
export const NonModal: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }

      dialog {
        position: fixed;
        top: 20%;
        right: 20px;
        padding: 24px;
        border-radius: 8px;
        border: 1px solid #ccc;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 300px;
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        font-size: 14px;
        margin: 0 0 16px;
      }
      dialog .close-button {
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
        font-size: 14px;
      }
      .other-content {
        margin-top: 20px;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      .other-content input {
        padding: 8px;
        margin-right: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    </style>

    <dialog-root .modal=${false}>
      <dialog-trigger as-child>
        <button class="trigger-button">Open Non-Modal Dialog</button>
      </dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Notification Panel</h2>
        <p class="description" data-dialog-description>
          This is a non-modal dialog. You can still interact with the page.
        </p>
        <button class="close-button" data-dialog-close>Dismiss</button>
      </dialog>
    </dialog-root>

    <div class="other-content">
      <p>This content remains interactive when the non-modal dialog is open:</p>
      <input type="text" placeholder="Type here..." />
      <button>Click me</button>
    </div>
  `,
};

/**
 * Dialog with form content and multiple close triggers.
 */
export const WithForm: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }

      dialog {
        padding: 24px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
      }
      .form-field {
        margin-bottom: 16px;
      }
      .form-field label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
      }
      .form-field input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .button-group button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }
      .button-cancel {
        border: 1px solid #ccc;
        background: white;
      }
      .button-save {
        border: none;
        background: #3b82f6;
        color: white;
      }
    </style>

    <dialog-root>
      <dialog-trigger as-child>
        <button class="trigger-button">Edit Profile</button>
      </dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Edit Profile</h2>
        <p class="description" data-dialog-description>
          Update your profile information below.
        </p>
        <form @submit=${(e: Event) => e.preventDefault()}>
          <div class="form-field">
            <label for="name">Name</label>
            <input type="text" id="name" value="John Doe" />
          </div>
          <div class="form-field">
            <label for="email">Email</label>
            <input type="email" id="email" value="john@example.com" />
          </div>
          <div class="button-group">
            <button type="button" class="button-cancel" data-dialog-close>
              Cancel
            </button>
            <button type="submit" class="button-save" data-dialog-close>
              Save Changes
            </button>
          </div>
        </form>
      </dialog>
    </dialog-root>
  `,
};

/**
 * Dialog without as-child - the trigger component itself acts as the button.
 */
export const WithoutAsChild: Story = {
  render: () => html`
    <style>
      dialog-trigger {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      dialog-trigger:hover {
        background: #f5f5f5;
      }

      dialog {
        padding: 24px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
      }

      dialog h2 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
      }
      dialog-close {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
      dialog-close:hover {
        background: #2563eb;
      }
    </style>

    <dialog-root>
      <dialog-trigger>Open Dialog</dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Without as-child</h2>
        <p class="description" data-dialog-description>
          This example shows dialog-trigger and dialog-close components used
          without the as-child attribute. The components themselves act as the
          interactive elements.
        </p>
        <dialog-close>Close</dialog-close>
      </dialog>
    </dialog-root>
  `,
};

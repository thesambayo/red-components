import { Meta, StoryObj } from "@storybook/web-components";
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
      description: "Whether dialog is modal (traps focus, has overlay)",
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
 * Basic dialog with overlay, title, description, and close button.
 */
export const Basic: Story = {
  render: () => html`
    <style>
      dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      dialog-trigger button:hover {
        background: #f5f5f5;
      }
      dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
        z-index: 51;
      }
      dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      dialog-description {
        display: block;
        color: #666;
        margin-bottom: 16px;
      }
      dialog-close button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
      dialog-close button:hover {
        background: #2563eb;
      }
    </style>

    <dialog-root>
      <dialog-trigger>
        <button>Open Dialog</button>
      </dialog-trigger>
      <dialog-portal>
        <dialog-overlay></dialog-overlay>
        <dialog-content>
          <dialog-title>Edit Profile</dialog-title>
          <dialog-description>
            Make changes to your profile here. Click save when you're done.
          </dialog-description>
          <p>Your profile content goes here...</p>
          <dialog-close>
            <button>Close</button>
          </dialog-close>
        </dialog-content>
      </dialog-portal>
    </dialog-root>
  `,
};

/**
 * Controlled dialog where open state is managed externally.
 */
export const Controlled: Story = {
  render: (args) => html`
    <style>
      dialog-trigger button,
      .external-trigger {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
        margin-right: 8px;
      }
      dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
        z-index: 51;
      }
      dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      dialog-description {
        display: block;
        color: #666;
        margin-bottom: 16px;
      }
      dialog-close button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #3b82f6;
        color: white;
        cursor: pointer;
      }
    </style>

    <dialog-root .open=${args.open}>
      <dialog-trigger>
        <button>Open Dialog</button>
      </dialog-trigger>
      <dialog-portal>
        <dialog-overlay></dialog-overlay>
        <dialog-content>
          <dialog-title>Controlled Dialog</dialog-title>
          <dialog-description>
            This dialog's open state is controlled via the "open" prop.
          </dialog-description>
          <dialog-close>
            <button>Close</button>
          </dialog-close>
        </dialog-content>
      </dialog-portal>
    </dialog-root>
  `,
  args: {
    open: false,
  },
};

/**
 * Non-modal dialog that doesn't trap focus or block interaction.
 */
export const NonModal: Story = {
  render: () => html`
    <style>
      dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      dialog-content {
        position: fixed;
        top: 20%;
        right: 20px;
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        z-index: 51;
      }
      dialog-title {
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      dialog-description {
        display: block;
        color: #666;
        font-size: 14px;
        margin-bottom: 16px;
      }
      dialog-close button {
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

    <dialog-root modal="false">
      <dialog-trigger>
        <button>Open Non-Modal Dialog</button>
      </dialog-trigger>
      <dialog-portal>
        <dialog-content>
          <dialog-title>Notification Panel</dialog-title>
          <dialog-description>
            This is a non-modal dialog. You can still interact with the page.
          </dialog-description>
          <dialog-close>
            <button>Dismiss</button>
          </dialog-close>
        </dialog-content>
      </dialog-portal>
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
      dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 450px;
        width: 90%;
        z-index: 51;
      }
      dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      dialog-description {
        display: block;
        color: #666;
        margin-bottom: 16px;
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
      <dialog-trigger>
        <button>Edit Profile</button>
      </dialog-trigger>
      <dialog-portal>
        <dialog-overlay></dialog-overlay>
        <dialog-content>
          <dialog-title>Edit Profile</dialog-title>
          <dialog-description>
            Update your profile information below.
          </dialog-description>
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
              <dialog-close>
                <button type="button" class="button-cancel">Cancel</button>
              </dialog-close>
              <dialog-close>
                <button type="submit" class="button-save">Save Changes</button>
              </dialog-close>
            </div>
          </form>
        </dialog-content>
      </dialog-portal>
    </dialog-root>
  `,
};

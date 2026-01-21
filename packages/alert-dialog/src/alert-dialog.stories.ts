import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_ALERT_DIALOG_URL);

const meta = {
  title: "Primitives/AlertDialog",
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
    defaultOpen: false,
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

/**
 * Basic alert dialog for confirming destructive actions.
 * Uses native `<dialog>` element with backdrop styling.
 * Note: clicking the backdrop or pressing Escape does NOT close the dialog.
 */
export const Basic: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      .trigger-button:hover {
        background: #b91c1c;
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
        margin: 0 0 20px;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .cancel-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .cancel-button:hover {
        background: #f5f5f5;
      }
      .action-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      .action-button:hover {
        background: #b91c1c;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger as-child>
        <button class="trigger-button">Delete Item</button>
      </alert-dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Delete Item</h2>
        <p class="description" data-dialog-description>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div class="button-group">
          <alert-dialog-cancel as-child>
            <button class="cancel-button">Cancel</button>
          </alert-dialog-cancel>
          <alert-dialog-action as-child>
            <button class="action-button">Delete</button>
          </alert-dialog-action>
        </div>
      </dialog>
    </alert-dialog-root>
  `,
};

/**
 * Alert dialog for account deletion with more detailed content.
 */
export const AccountDeletion: Story = {
  render: () => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: white;
        color: #dc2626;
        cursor: pointer;
      }
      .trigger-button:hover {
        background: #fef2f2;
      }

      dialog {
        padding: 24px;
        border-radius: 12px;
        border: none;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
      }

      dialog h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 600;
        color: #dc2626;
      }
      dialog .description {
        color: #666;
        margin: 0 0 16px;
        line-height: 1.5;
      }
      .warning-list {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
      }
      .warning-list ul {
        margin: 0;
        padding-left: 20px;
        color: #991b1b;
      }
      .warning-list li {
        margin-bottom: 4px;
      }
      .button-group {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      .cancel-button {
        padding: 10px 20px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
        font-weight: 500;
      }
      .cancel-button:hover {
        background: #f5f5f5;
      }
      .action-button {
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
        font-weight: 500;
      }
      .action-button:hover {
        background: #b91c1c;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger as-child>
        <button class="trigger-button">Delete Account</button>
      </alert-dialog-trigger>

      <dialog>
        <h2 data-dialog-title>⚠️ Delete Account</h2>
        <p class="description" data-dialog-description>
          You are about to permanently delete your account. This action is
          irreversible and will result in the loss of all your data.
        </p>
        <div class="warning-list">
          <ul>
            <li>All your personal data will be deleted</li>
            <li>Your subscription will be cancelled</li>
            <li>You will lose access to all your files</li>
            <li>Your username will become available to others</li>
          </ul>
        </div>
        <div class="button-group">
          <alert-dialog-cancel as-child>
            <button class="cancel-button">Keep Account</button>
          </alert-dialog-cancel>
          <alert-dialog-action as-child>
            <button class="action-button">Delete Forever</button>
          </alert-dialog-action>
        </div>
      </dialog>
    </alert-dialog-root>
  `,
};

/**
 * Unsaved changes alert dialog.
 */
export const UnsavedChanges: Story = {
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
        max-width: 400px;
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
        margin: 0 0 20px;
        line-height: 1.5;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .cancel-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .action-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #f59e0b;
        color: white;
        cursor: pointer;
      }
      .action-button:hover {
        background: #d97706;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger as-child>
        <button class="trigger-button">Leave Page</button>
      </alert-dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Unsaved Changes</h2>
        <p class="description" data-dialog-description>
          You have unsaved changes. If you leave this page, your changes will be
          lost. Are you sure you want to continue?
        </p>
        <div class="button-group">
          <alert-dialog-cancel as-child>
            <button class="cancel-button">Stay on Page</button>
          </alert-dialog-cancel>
          <alert-dialog-action as-child>
            <button class="action-button">Discard Changes</button>
          </alert-dialog-action>
        </div>
      </dialog>
    </alert-dialog-root>
  `,
};

/**
 * Controlled alert dialog where open state is managed externally.
 */
export const Controlled: Story = {
  render: (args) => html`
    <style>
      .trigger-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: #dc2626;
        color: white;
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
        margin: 0 0 20px;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .cancel-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      .action-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
    </style>

    <alert-dialog-root .open=${args.open}>
      <alert-dialog-trigger as-child>
        <button class="trigger-button">Open Alert</button>
      </alert-dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Controlled Alert Dialog</h2>
        <p class="description" data-dialog-description>
          This alert dialog's open state is controlled via the "open" prop.
        </p>
        <div class="button-group">
          <alert-dialog-cancel as-child>
            <button class="cancel-button">Cancel</button>
          </alert-dialog-cancel>
          <alert-dialog-action as-child>
            <button class="action-button">Confirm</button>
          </alert-dialog-action>
        </div>
      </dialog>
    </alert-dialog-root>
  `,
  args: {
    open: false,
  },
};

/**
 * Alert dialog without as-child - components themselves act as the interactive elements.
 */
export const WithoutAsChild: Story = {
  render: () => html`
    <style>
      alert-dialog-trigger {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      alert-dialog-trigger:hover {
        background: #b91c1c;
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
        margin: 0 0 20px;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      alert-dialog-cancel {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      alert-dialog-cancel:hover {
        background: #f5f5f5;
      }
      alert-dialog-action {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      alert-dialog-action:hover {
        background: #b91c1c;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger>Delete Item</alert-dialog-trigger>

      <dialog>
        <h2 data-dialog-title>Without as-child</h2>
        <p class="description" data-dialog-description>
          This example shows alert-dialog-trigger, alert-dialog-cancel, and
          alert-dialog-action components used without the as-child attribute.
          The components themselves act as the interactive elements.
        </p>
        <div class="button-group">
          <alert-dialog-cancel>Cancel</alert-dialog-cancel>
          <alert-dialog-action>Delete</alert-dialog-action>
        </div>
      </dialog>
    </alert-dialog-root>
  `,
};

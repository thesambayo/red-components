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
 * Note how clicking the overlay does NOT close the dialog.
 */
export const Basic: Story = {
  render: () => html`
    <style>
      alert-dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      alert-dialog-trigger button:hover {
        background: #b91c1c;
      }
      alert-dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      alert-dialog-content {
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
      alert-dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      alert-dialog-description {
        display: block;
        color: #666;
        margin-bottom: 20px;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      alert-dialog-cancel button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      alert-dialog-cancel button:hover {
        background: #f5f5f5;
      }
      alert-dialog-action button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      alert-dialog-action button:hover {
        background: #b91c1c;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger>
        <button>Delete Item</button>
      </alert-dialog-trigger>
      <alert-dialog-portal>
        <alert-dialog-overlay></alert-dialog-overlay>
        <alert-dialog-content>
          <alert-dialog-title>Delete Item</alert-dialog-title>
          <alert-dialog-description>
            Are you sure you want to delete this item? This action cannot be undone.
          </alert-dialog-description>
          <div class="button-group">
            <alert-dialog-cancel>
              <button>Cancel</button>
            </alert-dialog-cancel>
            <alert-dialog-action>
              <button>Delete</button>
            </alert-dialog-action>
          </div>
        </alert-dialog-content>
      </alert-dialog-portal>
    </alert-dialog-root>
  `,
};

/**
 * Alert dialog for account deletion with more detailed content.
 */
export const AccountDeletion: Story = {
  render: () => html`
    <style>
      alert-dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: white;
        color: #dc2626;
        cursor: pointer;
      }
      alert-dialog-trigger button:hover {
        background: #fef2f2;
      }
      alert-dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 50;
      }
      alert-dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        z-index: 51;
      }
      alert-dialog-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        font-weight: 600;
        color: #dc2626;
        margin-bottom: 12px;
      }
      alert-dialog-description {
        display: block;
        color: #666;
        margin-bottom: 16px;
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
      alert-dialog-cancel button {
        padding: 10px 20px;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
        font-weight: 500;
      }
      alert-dialog-cancel button:hover {
        background: #f5f5f5;
      }
      alert-dialog-action button {
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
        font-weight: 500;
      }
      alert-dialog-action button:hover {
        background: #b91c1c;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger>
        <button>Delete Account</button>
      </alert-dialog-trigger>
      <alert-dialog-portal>
        <alert-dialog-overlay></alert-dialog-overlay>
        <alert-dialog-content>
          <alert-dialog-title>
            ⚠️ Delete Account
          </alert-dialog-title>
          <alert-dialog-description>
            You are about to permanently delete your account. This action is irreversible
            and will result in the loss of all your data.
          </alert-dialog-description>
          <div class="warning-list">
            <ul>
              <li>All your personal data will be deleted</li>
              <li>Your subscription will be cancelled</li>
              <li>You will lose access to all your files</li>
              <li>Your username will become available to others</li>
            </ul>
          </div>
          <div class="button-group">
            <alert-dialog-cancel>
              <button>Keep Account</button>
            </alert-dialog-cancel>
            <alert-dialog-action>
              <button>Delete Forever</button>
            </alert-dialog-action>
          </div>
        </alert-dialog-content>
      </alert-dialog-portal>
    </alert-dialog-root>
  `,
};

/**
 * Unsaved changes alert dialog.
 */
export const UnsavedChanges: Story = {
  render: () => html`
    <style>
      alert-dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      alert-dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      alert-dialog-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 90%;
        z-index: 51;
      }
      alert-dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      alert-dialog-description {
        display: block;
        color: #666;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      alert-dialog-cancel button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      alert-dialog-action button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #f59e0b;
        color: white;
        cursor: pointer;
      }
      alert-dialog-action button:hover {
        background: #d97706;
      }
    </style>

    <alert-dialog-root>
      <alert-dialog-trigger>
        <button>Leave Page</button>
      </alert-dialog-trigger>
      <alert-dialog-portal>
        <alert-dialog-overlay></alert-dialog-overlay>
        <alert-dialog-content>
          <alert-dialog-title>Unsaved Changes</alert-dialog-title>
          <alert-dialog-description>
            You have unsaved changes. If you leave this page, your changes will be lost.
            Are you sure you want to continue?
          </alert-dialog-description>
          <div class="button-group">
            <alert-dialog-cancel>
              <button>Stay on Page</button>
            </alert-dialog-cancel>
            <alert-dialog-action>
              <button>Discard Changes</button>
            </alert-dialog-action>
          </div>
        </alert-dialog-content>
      </alert-dialog-portal>
    </alert-dialog-root>
  `,
};

/**
 * Controlled alert dialog where open state is managed externally.
 */
export const Controlled: Story = {
  render: (args) => html`
    <style>
      alert-dialog-trigger button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dc2626;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
      alert-dialog-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
      }
      alert-dialog-content {
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
      alert-dialog-title {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      alert-dialog-description {
        display: block;
        color: #666;
        margin-bottom: 20px;
      }
      .button-group {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      alert-dialog-cancel button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: white;
        cursor: pointer;
      }
      alert-dialog-action button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        background: #dc2626;
        color: white;
        cursor: pointer;
      }
    </style>

    <alert-dialog-root .open=${args.open}>
      <alert-dialog-trigger>
        <button>Open Alert</button>
      </alert-dialog-trigger>
      <alert-dialog-portal>
        <alert-dialog-overlay></alert-dialog-overlay>
        <alert-dialog-content>
          <alert-dialog-title>Controlled Alert Dialog</alert-dialog-title>
          <alert-dialog-description>
            This alert dialog's open state is controlled via the "open" prop.
          </alert-dialog-description>
          <div class="button-group">
            <alert-dialog-cancel>
              <button>Cancel</button>
            </alert-dialog-cancel>
            <alert-dialog-action>
              <button>Confirm</button>
            </alert-dialog-action>
          </div>
        </alert-dialog-content>
      </alert-dialog-portal>
    </alert-dialog-root>
  `,
  args: {
    open: false,
  },
};

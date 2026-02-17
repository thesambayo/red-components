import { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_SWITCH_URL);

const meta = {
  title: "Primitives/Switch",
  tags: ["autodocs"],
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }
      switch-root[data-disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
      switch-root[data-readonly] {
        cursor: default;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }
    </style>

    <switch-root>
      <switch-thumb></switch-thumb>
    </switch-root>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Basic: Story = {};

export const DefaultChecked: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }
    </style>

    <switch-root default-checked>
      <switch-thumb></switch-thumb>
    </switch-root>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }
      switch-root[data-disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }
    </style>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      <label
        style="display: flex; align-items: center; gap: 8px; color: #71717a;"
      >
        <switch-root disabled>
          <switch-thumb></switch-thumb>
        </switch-root>
        Disabled (off)
      </label>
      <label
        style="display: flex; align-items: center; gap: 8px; color: #71717a;"
      >
        <switch-root disabled default-checked>
          <switch-thumb></switch-thumb>
        </switch-root>
        Disabled (on)
      </label>
    </div>
  `,
};

export const ReadOnly: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: default;
        transition: background-color 0.2s;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }
    </style>

    <label style="display: flex; align-items: center; gap: 8px;">
      <switch-root readonly default-checked>
        <switch-thumb></switch-thumb>
      </switch-root>
      Read-only (always on)
    </label>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }

      .switch-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        font-family: system-ui, sans-serif;
      }
    </style>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <label class="switch-label">
        <switch-root>
          <switch-thumb></switch-thumb>
        </switch-root>
        Enable notifications
      </label>

      <label class="switch-label">
        <switch-root default-checked>
          <switch-thumb></switch-thumb>
        </switch-root>
        Dark mode
      </label>

      <label class="switch-label">
        <switch-root>
          <switch-thumb></switch-thumb>
        </switch-root>
        Auto-save
      </label>
    </div>
  `,
};

export const WithEvent: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }
    </style>

    <label
      style="display: flex; align-items: center; gap: 8px; font-family: system-ui, sans-serif; font-size: 14px; cursor: pointer;"
    >
      <switch-root
        @checkedChange=${(e: CustomEvent<{ checked: boolean }>) => {
          console.log("Checked changed:", e.detail.checked);
        }}
      >
        <switch-thumb></switch-thumb>
      </switch-root>
      Toggle me (check console)
    </label>
  `,
};

export const InForm: Story = {
  render: () => html`
    <style>
      switch-root {
        display: inline-flex;
        align-items: center;
        width: 44px;
        height: 24px;
        padding: 2px;
        border-radius: 9999px;
        background-color: #e4e4e7;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      switch-root:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      switch-root[data-checked] {
        background-color: #18181b;
      }

      switch-thumb {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s;
      }
      switch-thumb[data-checked] {
        transform: translateX(20px);
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 300px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
      }
      .form-container h3 {
        margin: 0 0 4px;
        font-size: 16px;
      }
      .form-container p {
        margin: 0 0 12px;
        color: #71717a;
        font-size: 13px;
      }
      .switch-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      .button-group {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }
      .button-group button {
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
      }
      .btn-submit {
        border: none;
        background: #18181b;
        color: white;
      }
      .btn-submit:hover {
        background: #27272a;
      }
      .btn-reset {
        border: 1px solid #d4d4d8;
        background: white;
      }
      .btn-reset:hover {
        background: #f4f4f5;
      }
    </style>

    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const entries = Object.fromEntries(formData);
        console.log("Form data:", entries);
        alert("Form data: " + JSON.stringify(entries, null, 2));
      }}
      class="form-container"
    >
      <div>
        <h3>Settings</h3>
        <p>Manage your notification preferences.</p>
      </div>

      <label class="switch-label">
        <switch-root name="notifications" value="enabled">
          <switch-thumb></switch-thumb>
        </switch-root>
        Notifications
      </label>

      <label class="switch-label">
        <switch-root name="marketing" value="enabled">
          <switch-thumb></switch-thumb>
        </switch-root>
        Marketing emails
      </label>

      <label class="switch-label">
        <switch-root name="dark-mode" value="on" default-checked>
          <switch-thumb></switch-thumb>
        </switch-root>
        Dark mode
      </label>

      <div class="button-group">
        <button type="submit" class="btn-submit">Submit</button>
        <button type="reset" class="btn-reset">Reset</button>
      </div>
    </form>
  `,
};

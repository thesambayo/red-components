import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DROPDOWN_URL);

const meta = {
  title: "Primitives/Dropdown",
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Side of trigger to display content",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment relative to trigger",
    },
    sideOffset: {
      control: "number",
      description: "Distance from trigger in pixels",
    },
  },
  args: {
    side: "bottom",
    align: "start",
    sideOffset: 4,
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

const styles = html`
  <style>
    .demo {
      padding: 100px;
      display: flex;
      justify-content: center;
    }

    dropdown-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
    }

    dropdown-trigger:hover {
      background: #f8fafc;
    }

    dropdown-trigger:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    dropdown-content {
      min-width: 180px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 4px;
    }

    dropdown-item {
      display: block;
      padding: 8px 12px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
    }

    dropdown-item:hover,
    dropdown-item:focus {
      background: #f1f5f9;
    }

    dropdown-item[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    dropdown-label {
      display: block;
      padding: 8px 12px 4px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    dropdown-separator {
      display: block;
      height: 1px;
      background: #e2e8f0;
      margin: 4px 0;
    }
  </style>
`;

export const Basic: Story = {
  render: (args) => html`
    ${styles}
    <div class="demo">
      <dropdown-root
        @dropdown:open=${() => console.log("Dropdown opened")}
        @dropdown:close=${() => console.log("Dropdown closed")}
      >
        <dropdown-trigger>
          Open Menu
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
          </svg>
        </dropdown-trigger>
        <dropdown-content
          side=${args.side}
          align=${args.align}
          side-offset=${args.sideOffset}
        >
          <dropdown-item
            value="edit"
            @dropdown:item-select=${(e) => console.log("Selected:", e.detail)}
          >
            Edit
          </dropdown-item>
          <dropdown-item
            value="duplicate"
            @dropdown:item-select=${(e) => console.log("Selected:", e.detail)}
          >
            Duplicate
          </dropdown-item>
          <dropdown-separator></dropdown-separator>
          <dropdown-item
            value="archive"
            @dropdown:item-select=${(e) => console.log("Selected:", e.detail)}
          >
            Archive
          </dropdown-item>
          <dropdown-item
            value="delete"
            @dropdown:item-select=${(e) => console.log("Selected:", e.detail)}
          >
            Delete
          </dropdown-item>
        </dropdown-content>
      </dropdown-root>
    </div>
  `,
};

export const WithLabelsAndGroups: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <dropdown-root>
        <dropdown-trigger>Actions</dropdown-trigger>
        <dropdown-content side="bottom" align="start">
          <dropdown-label>File</dropdown-label>
          <dropdown-item value="new">New File</dropdown-item>
          <dropdown-item value="open">Open...</dropdown-item>
          <dropdown-item value="save">Save</dropdown-item>
          <dropdown-separator></dropdown-separator>
          <dropdown-label>Edit</dropdown-label>
          <dropdown-item value="cut">Cut</dropdown-item>
          <dropdown-item value="copy">Copy</dropdown-item>
          <dropdown-item value="paste">Paste</dropdown-item>
        </dropdown-content>
      </dropdown-root>
    </div>
  `,
};

export const WithDisabledItems: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <dropdown-root>
        <dropdown-trigger>Options</dropdown-trigger>
        <dropdown-content side="bottom" align="start">
          <dropdown-item value="enabled">Enabled Option</dropdown-item>
          <dropdown-item value="disabled" disabled
            >Disabled Option</dropdown-item
          >
          <dropdown-item value="another">Another Option</dropdown-item>
        </dropdown-content>
      </dropdown-root>
    </div>
  `,
};

export const DifferentPlacements: Story = {
  render: () => html`
    ${styles}
    <style>
      .placement-demo {
        padding: 150px;
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        justify-content: center;
      }
    </style>
    <div class="placement-demo">
      <dropdown-root>
        <dropdown-trigger>Bottom Start</dropdown-trigger>
        <dropdown-content side="bottom" align="start">
          <dropdown-item>Option 1</dropdown-item>
          <dropdown-item>Option 2</dropdown-item>
        </dropdown-content>
      </dropdown-root>

      <dropdown-root>
        <dropdown-trigger>Bottom Center</dropdown-trigger>
        <dropdown-content side="bottom" align="center">
          <dropdown-item>Option 1</dropdown-item>
          <dropdown-item>Option 2</dropdown-item>
        </dropdown-content>
      </dropdown-root>

      <dropdown-root>
        <dropdown-trigger>Right Start</dropdown-trigger>
        <dropdown-content side="right" align="start">
          <dropdown-item>Option 1</dropdown-item>
          <dropdown-item>Option 2</dropdown-item>
        </dropdown-content>
      </dropdown-root>

      <dropdown-root>
        <dropdown-trigger>Top End</dropdown-trigger>
        <dropdown-content side="top" align="end">
          <dropdown-item>Option 1</dropdown-item>
          <dropdown-item>Option 2</dropdown-item>
        </dropdown-content>
      </dropdown-root>
    </div>
  `,
};

export const AsChild: Story = {
  render: () => html`
    ${styles}
    <style>
      .as-child-demo {
        padding: 100px;
        display: flex;
        gap: 24px;
        justify-content: center;
      }

      .custom-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;
      }

      .custom-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .custom-button:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
      }

      .custom-button[data-state="open"] {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      }
    </style>
    <div class="as-child-demo">
      <dropdown-root>
        <dropdown-trigger as-child>
          <button class="custom-button">
            Custom Button
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
              />
            </svg>
          </button>
        </dropdown-trigger>
        <dropdown-content side="bottom" align="start">
          <dropdown-item value="profile">Profile</dropdown-item>
          <dropdown-item value="settings">Settings</dropdown-item>
          <dropdown-separator></dropdown-separator>
          <dropdown-item value="logout">Log out</dropdown-item>
        </dropdown-content>
      </dropdown-root>
    </div>
  `,
};

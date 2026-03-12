import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./accordion";

const meta: Meta = {
  title: "Components/Accordion",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "Whether one or multiple items can be open",
    },
    collapsible: {
      control: "boolean",
      description: "Allow collapsing all items in single mode",
    },
    disabled: {
      control: "boolean",
      description: "Disable all accordion items",
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Orientation for keyboard navigation",
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
      description: "Reading direction",
    },
  },
};

export default meta;

type Story = StoryObj;

const accordionStyles = html`
  <style>
    accordion-root {
      display: block;
      width: 100%;
      max-width: 400px;
    }

    accordion-item {
      display: block;
      border-bottom: 1px solid #e5e5e5;
    }

    accordion-header {
      display: block;
    }

    accordion-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px;
      font-size: 15px;
      font-weight: 500;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
    }

    accordion-trigger:hover {
      background: #f5f5f5;
    }

    accordion-trigger:focus {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
    }

    accordion-trigger[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    accordion-trigger::after {
      content: "+";
      font-size: 20px;
      transition: transform 0.2s;
    }

    accordion-trigger[data-state="open"]::after {
      content: "-";
    }

    accordion-content {
      display: block;
      overflow: hidden;
    }

    accordion-content[hidden] {
      display: none;
    }

    accordion-content > div {
      padding: 0 16px 16px;
      color: #666;
    }
  </style>
`;

export const Default: Story = {
  args: {
    type: "single",
    collapsible: false,
    disabled: false,
    orientation: "vertical",
    dir: "ltr",
  },
  render: (args) => html`
    ${accordionStyles}
    <accordion-root
      type=${args.type}
      ?collapsible=${args.collapsible}
      ?disabled=${args.disabled}
      orientation=${args.orientation}
      dir=${args.dir}
      @change=${(e: CustomEvent) => console.log("Accordion changed:", e.detail)}
    >
      <accordion-item value="item-1">
        <accordion-header>
          <accordion-trigger>What is this component?</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>
            This is a new accordion component built with Lit and @lit/context
            for clean state management across components.
          </div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-2">
        <accordion-header>
          <accordion-trigger>How does it work?</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>
            The root component manages state and provides context to children.
            Items consume context to know their expanded state. Triggers toggle
            state via context methods.
          </div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-3">
        <accordion-header>
          <accordion-trigger
            >What about accessibility?</accordion-trigger
          >
        </accordion-header>
        <accordion-content>
          <div>
            Full ARIA support with proper roles, aria-expanded, aria-controls,
            and aria-labelledby attributes. Keyboard navigation works with Space
            and Enter keys.
          </div>
        </accordion-content>
      </accordion-item>
    </accordion-root>
  `,
};

export const MultipleOpen: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => html`
    ${accordionStyles}
    <accordion-root
      type=${args.type}
      @change=${(e: CustomEvent) => console.log("Accordion changed:", e.detail)}
    >
      <accordion-item value="item-1">
        <accordion-header>
          <accordion-trigger>Section 1</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>Content for section 1. Multiple items can be open at once.</div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-2">
        <accordion-header>
          <accordion-trigger>Section 2</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>
            Content for section 2. Try opening this alongside section 1.
          </div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-3">
        <accordion-header>
          <accordion-trigger>Section 3</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>
            Content for section 3. All three can be open simultaneously.
          </div>
        </accordion-content>
      </accordion-item>
    </accordion-root>
  `,
};

export const WithDefaultOpen: Story = {
  render: () => html`
    ${accordionStyles}
    <accordion-root type="single" default-value='["item-2"]'>
      <accordion-item value="item-1">
        <accordion-header>
          <accordion-trigger>Section 1</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>This section starts closed.</div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-2">
        <accordion-header>
          <accordion-trigger
            >Section 2 (Default Open)</accordion-trigger
          >
        </accordion-header>
        <accordion-content>
          <div>
            This section is open by default via default-value attribute.
          </div>
        </accordion-content>
      </accordion-item>
    </accordion-root>
  `,
};

export const Collapsible: Story = {
  render: () => html`
    ${accordionStyles}
    <accordion-root type="single" collapsible>
      <accordion-item value="item-1">
        <accordion-header>
          <accordion-trigger>Click me twice</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>
            With collapsible=true, you can click the trigger again to close this
            item (in single mode). Try it!
          </div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-2">
        <accordion-header>
          <accordion-trigger>Another section</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>Each section can be fully collapsed.</div>
        </accordion-content>
      </accordion-item>
    </accordion-root>
  `,
};

export const Disabled: Story = {
  render: () => html`
    ${accordionStyles}
    <accordion-root disabled>
      <accordion-item value="item-1">
        <accordion-header>
          <accordion-trigger>Disabled Section 1</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>You shouldn't be able to see this.</div>
        </accordion-content>
      </accordion-item>

      <accordion-item value="item-2">
        <accordion-header>
          <accordion-trigger>Disabled Section 2</accordion-trigger>
        </accordion-header>
        <accordion-content>
          <div>This is also disabled.</div>
        </accordion-content>
      </accordion-item>
    </accordion-root>
  `,
};

export const CompareWithOld: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
      <div>
        <h3 style="margin-bottom: 16px;">New Accordion</h3>
        ${accordionStyles}
        <accordion-root type="single" collapsible>
          <accordion-item value="item-1">
            <accordion-header>
              <accordion-trigger>Section 1</accordion-trigger>
            </accordion-header>
            <accordion-content>
              <div>New accordion content 1</div>
            </accordion-content>
          </accordion-item>
          <accordion-item value="item-2">
            <accordion-header>
              <accordion-trigger>Section 2</accordion-trigger>
            </accordion-header>
            <accordion-content>
              <div>New accordion content 2</div>
            </accordion-content>
          </accordion-item>
        </accordion-root>
      </div>
    </div>
  `,
};

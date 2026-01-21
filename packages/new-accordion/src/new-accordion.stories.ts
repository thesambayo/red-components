import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./new-accordion";

const meta: Meta = {
  title: "Components/NewAccordion",
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
    new-accordion-root {
      display: block;
      width: 100%;
      max-width: 400px;
    }

    new-accordion-item {
      display: block;
      border-bottom: 1px solid #e5e5e5;
    }

    new-accordion-header {
      display: block;
    }

    new-accordion-trigger {
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

    new-accordion-trigger:hover {
      background: #f5f5f5;
    }

    new-accordion-trigger:focus {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
    }

    new-accordion-trigger[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    new-accordion-trigger::after {
      content: "+";
      font-size: 20px;
      transition: transform 0.2s;
    }

    new-accordion-trigger[data-state="open"]::after {
      content: "-";
    }

    new-accordion-content {
      display: block;
      overflow: hidden;
    }

    new-accordion-content[hidden] {
      display: none;
    }

    new-accordion-content > div {
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
    <new-accordion-root
      type=${args.type}
      ?collapsible=${args.collapsible}
      ?disabled=${args.disabled}
      orientation=${args.orientation}
      dir=${args.dir}
      @change=${(e: CustomEvent) => console.log("Accordion changed:", e.detail)}
    >
      <new-accordion-item value="item-1">
        <new-accordion-header>
          <new-accordion-trigger>What is this component?</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>
            This is a new accordion component built with Lit and @lit/context
            for clean state management across components.
          </div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-2">
        <new-accordion-header>
          <new-accordion-trigger>How does it work?</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>
            The root component manages state and provides context to children.
            Items consume context to know their expanded state. Triggers toggle
            state via context methods.
          </div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-3">
        <new-accordion-header>
          <new-accordion-trigger
            >What about accessibility?</new-accordion-trigger
          >
        </new-accordion-header>
        <new-accordion-content>
          <div>
            Full ARIA support with proper roles, aria-expanded, aria-controls,
            and aria-labelledby attributes. Keyboard navigation works with Space
            and Enter keys.
          </div>
        </new-accordion-content>
      </new-accordion-item>
    </new-accordion-root>
  `,
};

export const MultipleOpen: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => html`
    ${accordionStyles}
    <new-accordion-root
      type=${args.type}
      @change=${(e: CustomEvent) => console.log("Accordion changed:", e.detail)}
    >
      <new-accordion-item value="item-1">
        <new-accordion-header>
          <new-accordion-trigger>Section 1</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>Content for section 1. Multiple items can be open at once.</div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-2">
        <new-accordion-header>
          <new-accordion-trigger>Section 2</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>
            Content for section 2. Try opening this alongside section 1.
          </div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-3">
        <new-accordion-header>
          <new-accordion-trigger>Section 3</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>
            Content for section 3. All three can be open simultaneously.
          </div>
        </new-accordion-content>
      </new-accordion-item>
    </new-accordion-root>
  `,
};

export const WithDefaultOpen: Story = {
  render: () => html`
    ${accordionStyles}
    <new-accordion-root type="single" default-value='["item-2"]'>
      <new-accordion-item value="item-1">
        <new-accordion-header>
          <new-accordion-trigger>Section 1</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>This section starts closed.</div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-2">
        <new-accordion-header>
          <new-accordion-trigger
            >Section 2 (Default Open)</new-accordion-trigger
          >
        </new-accordion-header>
        <new-accordion-content>
          <div>
            This section is open by default via default-value attribute.
          </div>
        </new-accordion-content>
      </new-accordion-item>
    </new-accordion-root>
  `,
};

export const Collapsible: Story = {
  render: () => html`
    ${accordionStyles}
    <new-accordion-root type="single" collapsible>
      <new-accordion-item value="item-1">
        <new-accordion-header>
          <new-accordion-trigger>Click me twice</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>
            With collapsible=true, you can click the trigger again to close this
            item (in single mode). Try it!
          </div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-2">
        <new-accordion-header>
          <new-accordion-trigger>Another section</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>Each section can be fully collapsed.</div>
        </new-accordion-content>
      </new-accordion-item>
    </new-accordion-root>
  `,
};

export const Disabled: Story = {
  render: () => html`
    ${accordionStyles}
    <new-accordion-root disabled>
      <new-accordion-item value="item-1">
        <new-accordion-header>
          <new-accordion-trigger>Disabled Section 1</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>You shouldn't be able to see this.</div>
        </new-accordion-content>
      </new-accordion-item>

      <new-accordion-item value="item-2">
        <new-accordion-header>
          <new-accordion-trigger>Disabled Section 2</new-accordion-trigger>
        </new-accordion-header>
        <new-accordion-content>
          <div>This is also disabled.</div>
        </new-accordion-content>
      </new-accordion-item>
    </new-accordion-root>
  `,
};

export const CompareWithOld: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
      <div>
        <h3 style="margin-bottom: 16px;">New Accordion</h3>
        ${accordionStyles}
        <new-accordion-root type="single" collapsible>
          <new-accordion-item value="item-1">
            <new-accordion-header>
              <new-accordion-trigger>Section 1</new-accordion-trigger>
            </new-accordion-header>
            <new-accordion-content>
              <div>New accordion content 1</div>
            </new-accordion-content>
          </new-accordion-item>
          <new-accordion-item value="item-2">
            <new-accordion-header>
              <new-accordion-trigger>Section 2</new-accordion-trigger>
            </new-accordion-header>
            <new-accordion-content>
              <div>New accordion content 2</div>
            </new-accordion-content>
          </new-accordion-item>
        </new-accordion-root>
      </div>
    </div>
  `,
};

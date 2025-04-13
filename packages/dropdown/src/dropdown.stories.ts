import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DROPDOWN_URL);

const meta = {
  title: "Primitives/Dropdown",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: { type: "boolean" },
      value: false,
      type: "boolean",
      description: "The controlled display of dropdown content",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  args: {
    open: false,
  },
  render: (args) => {
    return html`
      <dropdown-root open=${args.open}>
        <dropdown-trigger>Dropdown</dropdown-trigger>
        <dropdown-portal>
          <dropdown-content side="left" side-offset="20">
            <dropdown-item
              id="one"
              @dropdown-item-selected=${(event) => console.log(event.detail)}
            >
              Option 1
            </dropdown-item>
            <dropdown-item
              id="two"
              @dropdown-item-selected=${(event) => console.log(event.detail)}
            >
              Option 2
            </dropdown-item>
            <dropdown-item
              id="three"
              @dropdown-item-selected=${(event) => console.log(event)}
            >
              Option 3
            </dropdown-item>
          </dropdown-content>
        </dropdown-portal>
      </dropdown-root>
    `;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

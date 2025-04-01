import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DROPDOWN_URL);

const meta = {
  title: "Primitives/Dropdown",
  tags: ["autodocs"],
  render: () => {
    return html`<dropdown-root>
      <dropdown-trigger>Dropdown</dropdown-trigger>
      <dropdown-content side="top" side-offset="10">
        <dropdown-item @onSelect=${(event) => console.log(event)}>
          Option 1
        </dropdown-item>
        <dropdown-item @onSelect=${(event) => console.log(event)}>
          Option 2
        </dropdown-item>
        <dropdown-item @onSelect=${(event) => console.log(event)}>
          Option 3
        </dropdown-item>
      </dropdown-content>
    </dropdown-root>`;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

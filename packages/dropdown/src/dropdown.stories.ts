import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DROPDOWN_URL);

const meta = {
  title: "Primitives/Dropdown",
  tags: ["autodocs"],
  render: () => {
    return html`<dropdown-root>
      <div @click=${() => console.log("Option 1 selected")}>Option 1</div>
      <div @click=${() => console.log("Option 2 selected")}>Option 2</div>
      <div @click=${() => console.log("Option 3 selected")}>Option 3</div>
    </dropdown-root>`;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

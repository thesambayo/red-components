import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

// import "./toast";
await import(/* @vite-ignore */ import.meta.env.VITE_TOAST_URL);

const meta = {
  title: "Primitives/Toast",
  tags: ["autodocs"],
  render: () => {
    return html`
      <toast-provider>
        <p>toast</p>
        <toast-viewport></toast-viewport>
        <p>xamples</p>
      </toast-provider>
    `;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

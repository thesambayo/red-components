import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_TOAST_URL);

const meta = {
  title: "Primitives/Toast",
  tags: ["autodocs"],
  render: () => {
    return html` <toast-root> </toast-root> `;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

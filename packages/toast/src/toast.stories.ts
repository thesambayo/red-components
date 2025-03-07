import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_TOAST_URL);

const meta = {
  title: "Primitives/Toast",
  tags: ["autodocs"],
  render: () => {
    return html` <toast-root> </toast-root> `;
    // return html` <toast-root offset="20"> </toast-root> `;
    // return html` <toast-root offset="10px"> </toast-root> `;
    // return html` <toast-root offset="{ top: '10px', right: '20px', bottom: '30px', left: '40px' }"> </toast-root> `;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

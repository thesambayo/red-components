import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DIALOG_URL);

const meta = {
  title: "Primitives/Dialog",
  tags: ["autodocs"],
  render: () => {
    return html`
      <dialog-root>
        <dialog-trigger>Dropdown</dialog-trigger>
        <dialog-portal>
          <dialog-overlay></dialog-overlay>
          <dialog-content>
            <p>first</p>
            <p>Yesu, Mai Rahama</p>
            <dialog-close>close</dialog-close>
            <button data-dialog-close>close</button>
          </dialog-content>
        </dialog-portal>
      </dialog-root>
    `;
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const Basic: Story = {};

import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_DIALOG_URL);

const meta = {
  title: "Primitives/Dialog",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: { type: "boolean" },
      value: false,
      type: "boolean",
      description: "The controlled display of dialog content",
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
      <dialog-root open=${args.open}>
        <dialog-trigger>Open</dialog-trigger>
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

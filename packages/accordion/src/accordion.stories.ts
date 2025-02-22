import { html } from "lit";
import { fn } from "@storybook/test";
import { Meta, StoryObj } from "@storybook/web-components";

await import(/* @vite-ignore */ import.meta.env.VITE_ACCORDION_URL);
import { AccordionProps } from "./accordion-context";

const meta = {
  title: "Primitives/Accordion",
  tags: ["autodocs"],
  argTypes: {
    type: {
      options: ["single", "multiple"],
      control: { type: "select" },
    },
  },
  // @ts-ignore
  args: { change: fn() },
  render: (_args) => {
    return html` <accordion-root type=${_args.type} @change=${_args.change}>
      <accordion-item value="first">
        <accordion-trigger>acc trigger 1</accordion-trigger>
        <accordion-content>acc content 1</accordion-content>
      </accordion-item>
      <accordion-item value="second">
        <accordion-trigger>acc trigger 2</accordion-trigger>
        <accordion-content>acc content 2</accordion-content>
      </accordion-item>
      <accordion-item value="third">
        <accordion-trigger>acc trigger 3</accordion-trigger>
        <accordion-content>acc content 3</accordion-content>
      </accordion-item>
    </accordion-root>`;
  },
} satisfies Meta<AccordionProps>;

export default meta;
type Story = StoryObj<AccordionProps>;

export const Basic: Story = {
  args: {
    type: "single",
  },
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    orientation: "vertical",
  },
};

import { Meta, StoryObj } from "@storybook/web-components";
import { fn } from "@storybook/test";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_TOOLTIP_URL);

interface TooltipProps {
  open: boolean;
  "default-open": boolean;
  "delay-duration": number;
  "skip-delay-duration": number;
  openChange?: (e: CustomEvent<boolean>) => void;
  // content side
  side: "top" | "bottom" | "left" | "right";
  "side-offset": number;
  align: "start" | "center" | "end";
  "align-offset": number;
}

const meta = {
  title: "Primitives/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: { type: "boolean" },
      value: false,
      type: "boolean",
      description: "The controlled display of tooltip content",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    "default-open": {
      control: { type: "boolean" },
      value: false,
      type: "boolean",
      description:
        "The initial open state of the tooltip. Use when you do not want to control the open state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    "delay-duration": {
      name: "delay-duration",
      defaultValue: 500,
      control: { type: "number" },
      description:
        "The duration from when the mouse enters a tooltip trigger until the tooltip content opens. Value is in milliseconds.",
      table: {
        defaultValue: { summary: "500" },
      },
    },
    "skip-delay-duration": {
      name: "skip-delay-duration",
      defaultValue: 400,
      control: { type: "number" },
      description:
        "How much time a user has to enter another trigger without incurring a delay again",
      table: {
        defaultValue: { summary: "400" },
      },
    },
    side: {
      name: "side",
      defaultValue: "top",
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
      description: "The side of the trigger to display the content",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    "side-offset": {
      name: "side-offset",
      defaultValue: 0,
      control: { type: "number" },
      description: "The distance in pixels of the content from the trigger",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    align: {
      name: "align",
      defaultValue: "center",
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "The alignment of the content relative to the trigger",
      table: {
        defaultValue: { summary: "start" },
      },
    },
    "align-offset": {
      name: "align-offset",
      defaultValue: 0,
      control: { type: "number" },
      description:
        'An offset in pixels from the "start" or "end" alignment options.',
      table: {
        defaultValue: { summary: "0" },
      },
    },
  },
  args: {
    open: false,
    "default-open": false,
    "delay-duration": 500,
    "skip-delay-duration": 400,
    openChange: fn(),
    side: "top",
    "side-offset": 0,
    align: "center",
    "align-offset": 0,
  },
  render: (args) => {
    return html`
      <tooltip-root
        open=${args.open}
        default-open=${args["default-open"]}
        delay-duration=${args["delay-duration"]}
        skip-delay-duration=${args["skip-delay-duration"]}
        @openChange=${args.openChange}
      >
        <tooltip-trigger>Tooltip trigger</tooltip-trigger>
        <tooltip-content
          side=${args.side}
          side-offset=${args["side-offset"]}
          align=${args.align}
          align-offset=${args["align-offset"]}
        >
          Content
        </tooltip-content>
      </tooltip-root>
    `;
  },
} satisfies Meta<TooltipProps>;

export default meta;
type Story = StoryObj<TooltipProps>;

export const Basic: Story = {};

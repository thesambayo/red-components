import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_TABS_URL);
import { TabContext } from "./tabs-context";

const meta = {
  title: "Primitives/Tabs",
  // tags: ["autodocs"],
  // argTypes: {
  //
  // },
  render: (_args) =>
    html`<tabs-root>
      <tabs-list>
        <tab-trigger value="account">tab-1</tab-trigger>
        <tab-trigger value="password">tab-2</tab-trigger>
        <tab-trigger value="delete">tab-3</tab-trigger>
      </tabs-list>
      <tab-content value="account">content-1</tab-content>
      <tab-content value="password">content-2</tab-content>
      <tab-content value="delete">content-3</tab-content>
    </tabs-root>`,
} satisfies Meta<TabContext>;

export default meta;
type Story = StoryObj<TabContext>;

export const Basic: Story = {};

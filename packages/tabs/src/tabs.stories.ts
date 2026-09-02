import { Meta, StoryObj } from "@storybook/web-components-vite";
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

/**
 * Loop navigation allows keyboard navigation to wrap from the last tab to the first.
 * Use arrow keys to navigate and see the loop behavior.
 */
export const WithLoop: Story = {
  render: () =>
    html`<tabs-root default-value="tab2" loop>
      <tabs-list>
        <tab-trigger value="tab1">Tab 1</tab-trigger>
        <tab-trigger value="tab2">Tab 2</tab-trigger>
        <tab-trigger value="tab3">Tab 3</tab-trigger>
      </tabs-list>
      <tab-content value="tab1">Content 1</tab-content>
      <tab-content value="tab2">Content 2</tab-content>
      <tab-content value="tab3">Content 3</tab-content>
    </tabs-root>`,
};

/**
 * Manual activation mode requires users to press Enter or Space to activate a tab after focusing it.
 * Use arrow keys to move focus, then press Enter/Space to activate.
 */
export const ManualActivation: Story = {
  render: () =>
    html`<tabs-root activation-mode="manual">
      <tabs-list>
        <tab-trigger value="tab1">Tab 1</tab-trigger>
        <tab-trigger value="tab2">Tab 2</tab-trigger>
        <tab-trigger value="tab3">Tab 3</tab-trigger>
      </tabs-list>
      <tab-content value="tab1">
        <p>
          Content 1 - Use arrow keys to navigate, then press Enter/Space to
          activate
        </p>
      </tab-content>
      <tab-content value="tab2">
        <p>Content 2</p>
      </tab-content>
      <tab-content value="tab3">
        <p>Content 3</p>
      </tab-content>
    </tabs-root>`,
};

/**
 * Unmount on hide removes inactive tab content from the DOM for better performance
 * with heavy content. Inactive tabs are completely unmounted rather than just hidden.
 */
export const UnmountOnHide: Story = {
  render: () =>
    html`<tabs-root unmount-on-hide>
      <tabs-list>
        <tab-trigger value="tab1">Tab 1</tab-trigger>
        <tab-trigger value="tab2">Tab 2</tab-trigger>
        <tab-trigger value="tab3">Tab 3</tab-trigger>
      </tabs-list>
      <tab-content value="tab1">
        <p>Content 1 - Inactive tabs are removed from DOM</p>
      </tab-content>
      <tab-content value="tab2">
        <p>
          Content 2 - Check the DOM inspector to see this is unmounted when
          inactive
        </p>
      </tab-content>
      <tab-content value="tab3">
        <p>Content 3</p>
      </tab-content>
    </tabs-root>`,
};

/**
 * Vertical orientation with RTL direction support
 */
export const Vertical: Story = {
  render: () =>
    html`<tabs-root orientation="vertical" dir="ltr">
      <tabs-list>
        <tab-trigger value="tab1">Tab 1</tab-trigger>
        <tab-trigger value="tab2">Tab 2</tab-trigger>
        <tab-trigger value="tab3">Tab 3</tab-trigger>
      </tabs-list>
      <tab-content value="tab1">Vertical Content 1</tab-content>
      <tab-content value="tab2">Vertical Content 2</tab-content>
      <tab-content value="tab3">Vertical Content 3</tab-content>
    </tabs-root>`,
};

/**
 * Combining multiple features: loop, manual activation, and unmount on hide
 */
export const AllFeatures: Story = {
  render: () =>
    html`<tabs-root loop activation-mode="manual" unmount-on-hide>
      <tabs-list>
        <tab-trigger value="tab1">Tab 1</tab-trigger>
        <tab-trigger value="tab2">Tab 2</tab-trigger>
        <tab-trigger value="tab3">Tab 3</tab-trigger>
      </tabs-list>
      <tab-content value="tab1">
        <p>Features enabled:</p>
        <ul>
          <li>Loop navigation</li>
          <li>Manual activation</li>
          <li>Unmount on hide</li>
        </ul>
      </tab-content>
      <tab-content value="tab2">Content 2</tab-content>
      <tab-content value="tab3">Content 3</tab-content>
    </tabs-root>`,
};

/**
 * Styling the trigger component directly - it is the control.
 * This allows you to style your own buttons while getting tab trigger behavior.
 */
export const StyledTriggers: Story = {
  render: () =>
    html`<tabs-root>
      <tabs-list>
        <tab-trigger value="tab1">
          <button style="padding: 8px 16px; margin: 4px;">
            Custom Button 1
          </button>
        </tab-trigger>
        <tab-trigger value="tab2">
          <button style="padding: 8px 16px; margin: 4px;">
            Custom Button 2
          </button>
        </tab-trigger>
        <tab-trigger value="tab3">
          <button style="padding: 8px 16px; margin: 4px;">
            Custom Button 3
          </button>
        </tab-trigger>
      </tabs-list>
      <tab-content value="tab1">
        <p>
          Content 1 - The tab triggers are styled directly as
          custom buttons
        </p>
      </tab-content>
      <tab-content value="tab2">
        <p>Content 2 - You can style the buttons however you want</p>
      </tab-content>
      <tab-content value="tab3">
        <p>
          Content 3 - ARIA attributes and event handlers are applied to the
          child buttons
        </p>
      </tab-content>
    </tabs-root>`,
};

/**
 * Escape hatch: `data-tab-trigger="<value>"` on your own element. These
 * participate in arrow-key navigation exactly like `<tab-trigger>`.
 */
export const EscapeHatchTriggers: Story = {
  render: () => html`
    <style>
      .eh-tab {
        padding: 8px 16px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-bottom: 2px solid transparent;
      }
      .eh-tab[data-state="active"] {
        border-bottom-color: #3b82f6;
        font-weight: 600;
      }
    </style>
    <tabs-root default-value="a">
      <tabs-list>
        <button class="eh-tab" data-tab-trigger="a">First</button>
        <button class="eh-tab" data-tab-trigger="b">Second</button>
        <button class="eh-tab" data-tab-trigger="c">Third</button>
      </tabs-list>
      <tab-content value="a">Panel A</tab-content>
      <tab-content value="b">Panel B</tab-content>
      <tab-content value="c">Panel C</tab-content>
    </tabs-root>
  `,
};

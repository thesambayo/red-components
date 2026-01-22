import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./tooltip";

const meta: Meta = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Which side of the trigger to display on",
    },
    sideOffset: {
      control: "number",
      description: "Distance from trigger in pixels",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment along the side",
    },
    delayDuration: {
      control: "number",
      description: "Delay before showing tooltip (ms)",
    },
  },
};

export default meta;

type Story = StoryObj;

const tooltipStyles = html`
  <style>
    .tooltip-demo {
      padding: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tooltip-demo-row {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
    }

    tooltip-trigger {
      display: inline-block;
    }

    .trigger-button {
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .trigger-button:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .trigger-button:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    tooltip-content {
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.4;
      max-width: 220px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    tooltip-arrow {
      --tooltip-arrow-fill: #1f2937;
    }

    .info-text {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 20px;
      text-align: center;
    }
  </style>
`;

export const Default: Story = {
  args: {
    side: "top",
    sideOffset: 8,
    align: "center",
    delayDuration: 500,
  },
  render: (args) => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <tooltip-root
        delay-duration=${args.delayDuration}
        @openChange=${(e: CustomEvent) => console.log("Tooltip:", e.detail)}
      >
        <tooltip-trigger>
          <button class="trigger-button">Hover me</button>
        </tooltip-trigger>
        <tooltip-content
          side=${args.side}
          side-offset=${args.sideOffset}
          align=${args.align}
        >
          <tooltip-arrow></tooltip-arrow>
          This is a helpful tooltip that provides additional context.
        </tooltip-content>
      </tooltip-root>
    </div>
  `,
};

export const AllSides: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div class="tooltip-demo-row">
        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Top</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Tooltip on top
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Right</button>
          </tooltip-trigger>
          <tooltip-content side="right" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Tooltip on right
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Bottom</button>
          </tooltip-trigger>
          <tooltip-content side="bottom" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Tooltip on bottom
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Left</button>
          </tooltip-trigger>
          <tooltip-content side="left" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Tooltip on left
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const Alignments: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div class="tooltip-demo-row">
        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Start aligned</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8" align="start">
            <tooltip-arrow></tooltip-arrow>
            Aligned to start
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Center aligned</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8" align="center">
            <tooltip-arrow></tooltip-arrow>
            Aligned to center
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">End aligned</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8" align="end">
            <tooltip-arrow></tooltip-arrow>
            Aligned to end
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const InstantOpen: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div style="text-align: center;">
        <p class="info-text">
          This tooltip has no delay - it appears instantly.
        </p>
        <tooltip-root delay-duration="0">
          <tooltip-trigger>
            <button class="trigger-button">Instant tooltip</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            I appear instantly!
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const HoverableContent: Story = {
  render: () => html`
    ${tooltipStyles}
    <style>
      .hoverable-tooltip {
        padding: 12px;
      }
      .hoverable-tooltip a {
        color: #60a5fa;
        text-decoration: underline;
      }
      .hoverable-tooltip a:hover {
        color: #93c5fd;
      }
    </style>
    <div class="tooltip-demo">
      <div style="text-align: center;">
        <p class="info-text">
          You can move your cursor to the tooltip content - it stays open!
        </p>
        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Hover and move to content</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            <div class="hoverable-tooltip">
              This content is interactive!<br />
              <a href="#" onclick="event.preventDefault(); alert('Clicked!')">
                Click this link
              </a>
            </div>
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const WithProvider: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div style="text-align: center;">
        <p class="info-text">
          With a provider, tooltips open instantly after another closes.
          <br />Try hovering between these buttons quickly!
        </p>
        <tooltip-provider delay-duration="500" skip-delay-duration="300">
          <div class="tooltip-demo-row">
            <tooltip-root>
              <tooltip-trigger>
                <button class="trigger-button">First</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                First tooltip
              </tooltip-content>
            </tooltip-root>

            <tooltip-root>
              <tooltip-trigger>
                <button class="trigger-button">Second</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                Second tooltip (instant!)
              </tooltip-content>
            </tooltip-root>

            <tooltip-root>
              <tooltip-trigger>
                <button class="trigger-button">Third</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                Third tooltip (also instant!)
              </tooltip-content>
            </tooltip-root>
          </div>
        </tooltip-provider>
      </div>
    </div>
  `,
};

export const KeyboardAccessible: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div style="text-align: center;">
        <p class="info-text">
          Tab to focus the button to show tooltip.
          <br />Press Escape to close it.
        </p>
        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">Focus me with Tab</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Keyboard accessible! Press Escape to close.
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const WithoutArrow: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <div class="tooltip-demo-row">
        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">No arrow</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="6">
            Tooltip without an arrow
          </tooltip-content>
        </tooltip-root>

        <tooltip-root>
          <tooltip-trigger>
            <button class="trigger-button">With arrow</button>
          </tooltip-trigger>
          <tooltip-content side="top" side-offset="8">
            <tooltip-arrow></tooltip-arrow>
            Tooltip with an arrow
          </tooltip-content>
        </tooltip-root>
      </div>
    </div>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-demo {
        padding: 80px;
        display: flex;
        gap: 24px;
        justify-content: center;
      }

      .custom-demo tooltip-trigger button {
        padding: 10px 18px;
        font-size: 14px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
      }

      .success-btn {
        background: #10b981;
        color: white;
      }

      .warning-btn {
        background: #f59e0b;
        color: white;
      }

      .error-btn {
        background: #ef4444;
        color: white;
      }

      .success-tooltip {
        background: #10b981;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
      }

      .success-tooltip tooltip-arrow {
        --tooltip-arrow-fill: #10b981;
      }

      .warning-tooltip {
        background: #f59e0b;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
      }

      .warning-tooltip tooltip-arrow {
        --tooltip-arrow-fill: #f59e0b;
      }

      .error-tooltip {
        background: #ef4444;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
      }

      .error-tooltip tooltip-arrow {
        --tooltip-arrow-fill: #ef4444;
      }
    </style>
    <div class="custom-demo">
      <tooltip-root>
        <tooltip-trigger>
          <button class="success-btn">Success</button>
        </tooltip-trigger>
        <tooltip-content side="top" side-offset="8" class="success-tooltip">
          <tooltip-arrow></tooltip-arrow>
          Operation successful!
        </tooltip-content>
      </tooltip-root>

      <tooltip-root>
        <tooltip-trigger>
          <button class="warning-btn">Warning</button>
        </tooltip-trigger>
        <tooltip-content side="top" side-offset="8" class="warning-tooltip">
          <tooltip-arrow></tooltip-arrow>
          Proceed with caution
        </tooltip-content>
      </tooltip-root>

      <tooltip-root>
        <tooltip-trigger>
          <button class="error-btn">Error</button>
        </tooltip-trigger>
        <tooltip-content side="top" side-offset="8" class="error-tooltip">
          <tooltip-arrow></tooltip-arrow>
          Something went wrong
        </tooltip-content>
      </tooltip-root>
    </div>
  `,
};

export const LongContent: Story = {
  render: () => html`
    ${tooltipStyles}
    <div class="tooltip-demo">
      <tooltip-root>
        <tooltip-trigger>
          <button class="trigger-button">Hover for details</button>
        </tooltip-trigger>
        <tooltip-content side="top" side-offset="8">
          <tooltip-arrow></tooltip-arrow>
          This is a longer tooltip message that wraps to multiple lines. It
          provides more detailed information about the element being hovered.
          The max-width keeps it readable.
        </tooltip-content>
      </tooltip-root>
    </div>
  `,
};

export const JavaScriptConfiguration: Story = {
  render: () => {
    // Import the configuration API
    import("./context").then(({ configureTooltips }) => {
      // Configure global defaults
      configureTooltips({
        delayDuration: 200, // Fast delay for this demo
        skipDelayDuration: 500,
      });
    });

    return html`
      ${tooltipStyles}
      <div class="tooltip-demo">
        <div style="text-align: center;">
          <p class="info-text">
            This demo uses JavaScript configuration API to set global defaults.<br />
            <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
              configureTooltips({ delayDuration: 200 })
            </code>
            <br /><br />
            All tooltips below use the configured 200ms delay without needing a provider wrapper.
          </p>
          <div class="tooltip-demo-row">
            <tooltip-root>
              <tooltip-trigger>
                <button class="trigger-button">First tooltip</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                Uses global config (200ms delay)
              </tooltip-content>
            </tooltip-root>

            <tooltip-root>
              <tooltip-trigger>
                <button class="trigger-button">Second tooltip</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                Also uses global config
              </tooltip-content>
            </tooltip-root>

            <tooltip-root delay-duration="0">
              <tooltip-trigger>
                <button class="trigger-button">Override to instant</button>
              </tooltip-trigger>
              <tooltip-content side="top" side-offset="8">
                <tooltip-arrow></tooltip-arrow>
                This one overrides with delay-duration="0"
              </tooltip-content>
            </tooltip-root>
          </div>
        </div>
      </div>
    `;
  },
};

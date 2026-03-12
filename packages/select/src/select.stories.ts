import { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_SELECT_URL);

const meta = {
  title: "Primitives/Select",
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple selections",
    },
    disabled: {
      control: "boolean",
      description: "Disable the select",
    },
  },
  args: {
    multiple: false,
    disabled: false,
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

const styles = html`
  <style>
    .demo {
      padding: 100px;
      display: flex;
      justify-content: center;
    }

    select-root {
      display: inline-block;
      min-width: 200px;
    }

    select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      outline: none;
    }

    select-trigger:hover {
      background: #f8fafc;
    }

    select-trigger:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    select-trigger[data-state="open"] {
      border-color: #3b82f6;
    }

    select-trigger[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    select-trigger[data-placeholder] select-value {
      color: #94a3b8;
    }

    .trigger-icon {
      opacity: 0.5;
      flex-shrink: 0;
      transition: transform 0.2s;
    }

    select-trigger[data-state="open"] .trigger-icon {
      transform: rotate(180deg);
    }

    select-content [popover] {
      min-width: 200px;
      max-height: 300px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 4px;
      overflow-y: auto;
      margin: 4px 0;
    }

    select-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
    }

    select-item:hover,
    select-item:focus,
    select-item[data-highlighted] {
      background: #f1f5f9;
    }

    select-item[data-selected] {
      background: #dbeafe;
      color: #1e40af;
      font-weight: 500;
    }

    select-item[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    select-item-indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
    }

    select-group {
      display: block;
    }

    select-label {
      display: block;
      padding: 8px 12px 4px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    select-separator {
      display: block;
      height: 1px;
      background: #e2e8f0;
      margin: 4px 0;
    }
  </style>
`;

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
];

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];

export const Basic: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root
        @select:value-change=${(e) => console.log("Value changed:", e.detail)}
        @select:open-change=${(e) => console.log("Open changed:", e.detail)}
      >
        <select-trigger>
          <select-value placeholder="Select country..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          ${countries.map(
            (country) => html`
              <select-item value=${country.toLowerCase().replace(/ /g, "-")}>
                <select-item-indicator>✓</select-item-indicator>
                <select-item-text>${country}</select-item-text>
              </select-item>
            `
          )}
        </select-content>
      </select-root>
    </div>
  `,
};

export const WithDefaultValue: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root default-value="united-states">
        <select-trigger>
          <select-value placeholder="Select country..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          ${countries.map(
            (country) => html`
              <select-item value=${country.toLowerCase().replace(/ /g, "-")}>
                <select-item-indicator>✓</select-item-indicator>
                <select-item-text>${country}</select-item-text>
              </select-item>
            `
          )}
        </select-content>
      </select-root>
    </div>
  `,
};

export const MultipleSelection: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root
        multiple
        default-value='["apple", "banana"]'
        @select:value-change=${(e) =>
          console.log("Selected values:", e.detail.value)}
      >
        <select-trigger>
          <select-value placeholder="Select fruits..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          ${fruits.map(
            (fruit) => html`
              <select-item value=${fruit.toLowerCase()}>
                <select-item-indicator>✓</select-item-indicator>
                <select-item-text>${fruit}</select-item-text>
              </select-item>
            `
          )}
        </select-content>
      </select-root>
    </div>
  `,
};

export const WithGroups: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root>
        <select-trigger>
          <select-value placeholder="Select fruit..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          <select-group>
            <select-label>Citrus</select-label>
            <select-item value="orange">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Orange</select-item-text>
            </select-item>
            <select-item value="lemon">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Lemon</select-item-text>
            </select-item>
            <select-item value="lime">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Lime</select-item-text>
            </select-item>
          </select-group>
          <select-separator></select-separator>
          <select-group>
            <select-label>Berries</select-label>
            <select-item value="strawberry">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Strawberry</select-item-text>
            </select-item>
            <select-item value="blueberry">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Blueberry</select-item-text>
            </select-item>
            <select-item value="raspberry">
              <select-item-indicator>✓</select-item-indicator>
              <select-item-text>Raspberry</select-item-text>
            </select-item>
          </select-group>
        </select-content>
      </select-root>
    </div>
  `,
};

export const WithDisabledItems: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root>
        <select-trigger>
          <select-value placeholder="Select fruit..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          <select-item value="apple">
            <select-item-indicator>✓</select-item-indicator>
            <select-item-text>Apple</select-item-text>
          </select-item>
          <select-item value="banana">
            <select-item-indicator>✓</select-item-indicator>
            <select-item-text>Banana</select-item-text>
          </select-item>
          <select-item value="cherry" disabled>
            <select-item-indicator>✓</select-item-indicator>
            <select-item-text>Cherry (Out of stock)</select-item-text>
          </select-item>
          <select-item value="date">
            <select-item-indicator>✓</select-item-indicator>
            <select-item-text>Date</select-item-text>
          </select-item>
          <select-item value="elderberry" disabled>
            <select-item-indicator>✓</select-item-indicator>
            <select-item-text>Elderberry (Out of stock)</select-item-text>
          </select-item>
        </select-content>
      </select-root>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <select-root disabled default-value="apple">
        <select-trigger>
          <select-value placeholder="Select fruit..."></select-value>
          <svg
            class="trigger-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </select-trigger>
        <select-content>
          ${fruits.map(
            (fruit) => html`
              <select-item value=${fruit.toLowerCase()}>
                <select-item-indicator>✓</select-item-indicator>
                <select-item-text>${fruit}</select-item-text>
              </select-item>
            `
          )}
        </select-content>
      </select-root>
    </div>
  `,
};

export const FormIntegration: Story = {
  render: () => {
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Log all form data
      console.log("=== Form Submitted ===");
      const data: Record<string, any> = {};

      // Get all entries (handles multiple values correctly)
      for (const [key, value] of formData.entries()) {
        if (data[key]) {
          // Convert to array if multiple values exist
          data[key] = Array.isArray(data[key])
            ? [...data[key], value]
            : [data[key], value];
        } else {
          data[key] = value;
        }
      }

      console.log("Form data:", data);
      console.log("FormData entries:", Array.from(formData.entries()));

      // Show alert with the data
      alert(
        `Form submitted!\n\n${JSON.stringify(
          data,
          null,
          2
        )}\n\nCheck console for full details.`
      );
    };

    const handleReset = () => {
      console.log("Form reset");
    };

    return html`
      ${styles}
      <style>
        .form-demo {
          padding: 100px;
          max-width: 600px;
          margin: 0 auto;
        }
        .form-demo h3 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 600;
        }
        .form-demo p {
          margin-top: 0;
          margin-bottom: 24px;
          font-size: 14px;
          color: #64748b;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .form-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .form-actions button {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          outline: none;
        }

        .form-actions button[type="submit"] {
          background: #3b82f6;
          color: white;
        }

        .form-actions button[type="submit"]:hover {
          background: #2563eb;
        }

        .form-actions button[type="reset"] {
          background: #e2e8f0;
          color: #475569;
        }

        .form-actions button[type="reset"]:hover {
          background: #cbd5e1;
        }

        .form-demo select-root {
          display: block;
        }
      </style>
      <div class="form-demo">
        <h3>Form Integration</h3>
        <p>
          Select participates in forms using ElementInternals API. Single values
          submit as strings, multiple values submit like native &lt;select
          multiple&gt;.
        </p>

        <form @submit=${handleSubmit} @reset=${handleReset}>
          <div class="form-field">
            <label for="country">Country (single)</label>
            <select-root name="country" default-value="united-states">
              <select-trigger id="country">
                <select-value placeholder="Select country..."></select-value>
                <svg
                  class="trigger-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </select-trigger>
              <select-content>
                ${countries.slice(0, 5).map(
                  (country) => html`
                    <select-item value=${country.toLowerCase().replace(/ /g, "-")}>
                      <select-item-indicator>✓</select-item-indicator>
                      <select-item-text>${country}</select-item-text>
                    </select-item>
                  `
                )}
              </select-content>
            </select-root>
          </div>

          <div class="form-field">
            <label for="fruits">Favorite Fruits (multiple)</label>
            <select-root
              name="fruits"
              multiple
              default-value='["apple", "banana"]'
            >
              <select-trigger id="fruits">
                <select-value
                  placeholder="Select fruits..."
                ></select-value>
                <svg
                  class="trigger-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </select-trigger>
              <select-content>
                ${fruits.slice(0, 6).map(
                  (fruit) => html`
                    <select-item value=${fruit.toLowerCase()}>
                      <select-item-indicator>✓</select-item-indicator>
                      <select-item-text>${fruit}</select-item-text>
                    </select-item>
                  `
                )}
              </select-content>
            </select-root>
          </div>

          <div class="form-field">
            <label for="framework">Framework</label>
            <select-root name="framework">
              <select-trigger id="framework">
                <select-value
                  placeholder="Select framework..."
                ></select-value>
                <svg
                  class="trigger-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </select-trigger>
              <select-content>
                <select-item value="react">
                  <select-item-indicator>✓</select-item-indicator>
                  <select-item-text>React</select-item-text>
                </select-item>
                <select-item value="vue">
                  <select-item-indicator>✓</select-item-indicator>
                  <select-item-text>Vue</select-item-text>
                </select-item>
                <select-item value="angular">
                  <select-item-indicator>✓</select-item-indicator>
                  <select-item-text>Angular</select-item-text>
                </select-item>
                <select-item value="svelte">
                  <select-item-indicator>✓</select-item-indicator>
                  <select-item-text>Svelte</select-item-text>
                </select-item>
              </select-content>
            </select-root>
          </div>

          <div class="form-actions">
            <button type="submit">Submit Form</button>
            <button type="reset">Reset Form</button>
          </div>
        </form>
      </div>
    `;
  },
};

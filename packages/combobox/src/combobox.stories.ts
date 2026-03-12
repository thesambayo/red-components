import { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_COMBOBOX_URL);

const meta = {
  title: "Primitives/Combobox",
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom"],
      description: "Side of input to display content",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment relative to input",
    },
    sideOffset: {
      control: "number",
      description: "Distance from input in pixels",
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections",
    },
    filterMode: {
      control: "select",
      options: ["client", "manual"],
      description: "Filtering mode",
    },
  },
  args: {
    side: "bottom",
    align: "start",
    sideOffset: 4,
    multiple: false,
    filterMode: "client",
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

    combobox-root {
      display: inline-block;
      width: 300px;
    }

    combobox-input input {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      outline: none;
    }

    combobox-input input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    combobox-content {
      min-width: 300px;
      max-height: 300px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 4px;
      overflow-y: auto;
    }

    combobox-item {
      display: block;
      padding: 8px 12px;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
    }

    combobox-item:hover,
    combobox-item:focus,
    combobox-item[data-highlighted] {
      background: #f1f5f9;
    }

    combobox-item[data-selected] {
      background: #dbeafe;
      color: #1e40af;
      font-weight: 500;
    }

    combobox-item[data-disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    combobox-empty {
      display: block;
      padding: 16px 12px;
      font-size: 14px;
      color: #64748b;
      text-align: center;
    }
  </style>
`;

const fruits = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Papaya",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

export const Basic: Story = {
  render: (args) => html`
    ${styles}
    <div class="demo">
      <combobox-root
        @combobox:value-change=${(e) => console.log("Value changed:", e.detail)}
        @combobox:search-change=${(e) =>
          console.log("Search changed:", e.detail)}
        @combobox:open=${() => console.log("Combobox opened")}
        @combobox:close=${() => console.log("Combobox closed")}
      >
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content
          side=${args.side}
          align=${args.align}
          side-offset=${args.sideOffset}
        >
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const SelectStyle: Story = {
  render: () => {
    let selectedValue = "nextjs";

    const handleValueChange = (e: CustomEvent) => {
      selectedValue = e.detail.value;
      console.log("Selected:", selectedValue);
    };

    const frameworks = [
      { value: "nextjs", label: "Next.js" },
      { value: "sveltekit", label: "SvelteKit" },
      { value: "nuxtjs", label: "Nuxt.js" },
      { value: "remix", label: "Remix" },
      { value: "astro", label: "Astro" },
    ];

    return html`
      ${styles}
      <style>
        .select-demo {
          padding: 100px;
        }
        .select-demo h3 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 600;
        }
        .select-demo p {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 14px;
          color: #64748b;
        }

        combobox-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 300px;
          padding: 8px 12px;
          font-size: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          outline: none;
        }

        combobox-trigger:hover {
          background: #f8fafc;
        }

        combobox-trigger:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        combobox-trigger[data-state="open"] {
          border-color: #3b82f6;
        }

        .trigger-icon {
          opacity: 0.5;
          flex-shrink: 0;
        }

        /* Input inside content */
        combobox-content combobox-input {
          display: block;
          padding: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        combobox-content combobox-input input {
          width: 100%;
          padding: 8px 12px;
          font-size: 14px;
          border: none;
          outline: none;
          background: transparent;
        }

        combobox-content combobox-input input::placeholder {
          color: #94a3b8;
        }
      </style>
      <div class="select-demo">
        <h3>Select Style</h3>
        <p>Trigger anchors the dropdown, input is inside for searching</p>
        <combobox-root
          default-value="nextjs"
          @combobox:value-change=${handleValueChange}
        >
          <combobox-anchor>
            <combobox-trigger>
              <span>Select framework...</span>
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
            </combobox-trigger>
          </combobox-anchor>
          <combobox-content>
            <combobox-input placeholder="Search framework..."></combobox-input>
            ${frameworks.map(
              (framework) => html`
                <combobox-item value=${framework.value}>
                  ${framework.label}
                </combobox-item>
              `
            )}
            <combobox-empty>No framework found</combobox-empty>
          </combobox-content>
        </combobox-root>
      </div>
    `;
  },
};

export const InlineInputAndTrigger: Story = {
  render: () => html`
    ${styles}
    <style>
      .inline-demo {
        padding: 100px;
      }
      .inline-demo h3 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .inline-demo p {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
        color: #64748b;
      }

      /* Anchor contains both input and trigger inline */
      .inline-anchor {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding-right: 8px;
      }

      .inline-anchor:focus-within {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .inline-anchor combobox-input {
        flex: 1;
      }

      .inline-anchor combobox-input input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        border: none;
        outline: none;
        background: transparent;
      }

      .inline-anchor combobox-trigger {
        flex-shrink: 0;
        padding: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        opacity: 0.5;
      }

      .inline-anchor combobox-trigger:hover {
        opacity: 1;
      }
    </style>
    <div class="inline-demo">
      <h3>Inline Input + Trigger</h3>
      <p>Both input and trigger inside anchor, side by side</p>
      <combobox-root>
        <combobox-anchor class="inline-anchor">
          <combobox-input placeholder="Search fruits..."></combobox-input>
          <combobox-trigger>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </combobox-trigger>
        </combobox-anchor>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const MultipleSelect: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root
        multiple
        default-value='["apple", "banana"]'
        @combobox:value-change=${(e) =>
          console.log("Selected values:", e.detail.value)}
      >
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const WithDefaultValue: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root default-value="mango">
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const DefaultOpen: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root default-open>
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const WithDisabledItems: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root>
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          <combobox-item value="apple">Apple</combobox-item>
          <combobox-item value="banana">Banana</combobox-item>
          <combobox-item value="cherry" disabled
            >Cherry (Out of stock)</combobox-item
          >
          <combobox-item value="date">Date</combobox-item>
          <combobox-item value="elderberry" disabled
            >Elderberry (Out of stock)</combobox-item
          >
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const DisabledCombobox: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root disabled>
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const OpenOnFocus: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root open-on-focus>
        <combobox-input placeholder="Click to open..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const NoResetSearchOnSelect: Story = {
  render: () => html`
    ${styles}
    <div class="demo">
      <combobox-root reset-search-on-select="false">
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const FilteringDemo: Story = {
  render: () => html`
    ${styles}
    <style>
      .filtering-demo {
        padding: 100px;
      }
      .filtering-demo h3 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .filtering-demo p {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
        color: #64748b;
      }
    </style>
    <div class="filtering-demo">
      <h3>Try searching:</h3>
      <p>Type "berry" to filter fruits, or "xyz" to see empty state</p>
      <combobox-root>
        <combobox-input placeholder="Search fruits..."></combobox-input>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found matching your search</combobox-empty>
        </combobox-content>
      </combobox-root>
    </div>
  `,
};

export const ManualFilterMode: Story = {
  render: () => {
    let filteredFruits = fruits;
    const handleSearchChange = (e: CustomEvent) => {
      const search = e.detail.searchTerm.toLowerCase();
      filteredFruits = fruits.filter((fruit) =>
        fruit.toLowerCase().includes(search)
      );
      // Re-render would happen in a real framework
      console.log("Filtered fruits:", filteredFruits);
    };

    return html`
      ${styles}
      <style>
        .manual-demo {
          padding: 100px;
        }
        .manual-demo h3 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 600;
        }
        .manual-demo p {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 14px;
          color: #64748b;
        }
      </style>
      <div class="manual-demo">
        <h3>Manual Filter Mode</h3>
        <p>Filtering is handled externally (check console)</p>
        <combobox-root
          filter-mode="manual"
          @combobox:search-change=${handleSearchChange}
        >
          <combobox-input placeholder="Search fruits..."></combobox-input>
          <combobox-content>
            ${fruits.map(
              (fruit) => html`
                <combobox-item value=${fruit.toLowerCase()}
                  >${fruit}</combobox-item
                >
              `
            )}
            <combobox-empty>No fruits found</combobox-empty>
          </combobox-content>
        </combobox-root>
      </div>
    `;
  },
};

export const WithAnchor: Story = {
  render: () => html`
    ${styles}
    <style>
      .anchor-demo {
        padding: 100px;
      }
      .anchor-demo h3 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
      }
      .anchor-demo p {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
        color: #64748b;
      }
    </style>
    <div class="anchor-demo">
      <h3>With Anchor Element</h3>
      <p>Content anchors to the wrapper, not just the input. Try scrolling!</p>
      <combobox-root>
        <combobox-anchor>
          <combobox-input placeholder="Search fruits..."></combobox-input>
        </combobox-anchor>
        <combobox-content>
          ${fruits.map(
            (fruit) => html`
              <combobox-item value=${fruit.toLowerCase()}
                >${fruit}</combobox-item
              >
            `
          )}
          <combobox-empty>No fruits found</combobox-empty>
        </combobox-content>
      </combobox-root>
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

        .form-demo combobox-root {
          display: block;
        }
      </style>
      <div class="form-demo">
        <h3>Form Integration</h3>
        <p>
          Combobox participates in forms using ElementInternals API. Single
          values submit as strings, multiple values submit like native
          &lt;select multiple&gt;.
        </p>

        <form @submit=${handleSubmit} @reset=${handleReset}>
          <div class="form-field">
            <label for="favorite-fruit">Favorite Fruit (single)</label>
            <combobox-root name="favorite_fruit" default-value="apple">
              <combobox-input
                id="favorite-fruit"
                placeholder="Search fruits..."
              ></combobox-input>
              <combobox-content>
                ${fruits
                  .slice(0, 10)
                  .map(
                    (fruit) => html`
                      <combobox-item value=${fruit.toLowerCase()}>
                        ${fruit}
                      </combobox-item>
                    `
                  )}
                <combobox-empty>No fruits found</combobox-empty>
              </combobox-content>
            </combobox-root>
          </div>

          <div class="form-field">
            <label for="selected-fruits">Selected Fruits (multiple)</label>
            <combobox-root
              name="selected_fruits"
              default-value='["banana", "mango"]'
              multiple
            >
              <combobox-input
                id="selected-fruits"
                placeholder="Search and select multiple..."
              ></combobox-input>
              <combobox-content>
                ${fruits
                  .slice(0, 10)
                  .map(
                    (fruit) => html`
                      <combobox-item value=${fruit.toLowerCase()}>
                        ${fruit}
                      </combobox-item>
                    `
                  )}
                <combobox-empty>No fruits found</combobox-empty>
              </combobox-content>
            </combobox-root>
          </div>

          <div class="form-field">
            <label for="country">Country</label>
            <combobox-root name="country" default-value="us">
              <combobox-input
                id="country"
                placeholder="Select country..."
              ></combobox-input>
              <combobox-content>
                <combobox-item value="us">United States</combobox-item>
                <combobox-item value="uk">United Kingdom</combobox-item>
                <combobox-item value="ca">Canada</combobox-item>
                <combobox-item value="au">Australia</combobox-item>
                <combobox-item value="de">Germany</combobox-item>
                <combobox-item value="fr">France</combobox-item>
                <combobox-empty>No countries found</combobox-empty>
              </combobox-content>
            </combobox-root>
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

export const LargeList: Story = {
  render: () => {
    const countries = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "North Korea",
      "South Korea",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macedonia",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ];

    return html`
      ${styles}
      <style>
        .large-demo {
          padding: 100px;
        }
        .large-demo h3 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 16px;
          font-weight: 600;
        }
        .large-demo p {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 14px;
          color: #64748b;
        }
      </style>
      <div class="large-demo">
        <h3>Large List</h3>
        <p>Search through ${countries.length} countries</p>
        <combobox-root>
          <combobox-input placeholder="Search countries..."></combobox-input>
          <combobox-content max-height="300">
            ${countries.map(
              (country) => html`
                <combobox-item
                  value=${country.toLowerCase().replace(/ /g, "-")}
                >
                  ${country}
                </combobox-item>
              `
            )}
            <combobox-empty>No countries found</combobox-empty>
          </combobox-content>
        </combobox-root>
      </div>
    `;
  },
};

import { css } from "lit";

export const toastRootPositionStyles = css`
  :host {
    /* defaults */
    --offset-top: 20px;
    --offset-bottom: 20px;
    --offset-left: 20px;
    --offset-right: 20px;
    --mobile-offset-top: 16px;
    --mobile-offset-bottom: 16px;
    --mobile-offset-left: 16px;
    --mobile-offset-right: 16px;

    position: fixed;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;
    z-index: 999999999;
    transition: transform 400ms ease;

    display: flex;
    gap: 0.75rem;
  }

  /* positionings */
  :host([data-y-position="top"]) {
    top: var(--offset-top);
    flex-direction: column;
  }

  :host([data-y-position="bottom"]) {
    bottom: var(--offset-bottom);
    flex-direction: column-reverse;
  }

  :host([data-x-position="right"]) {
    right: var(--offset-right);
  }

  :host([data-x-position="left"]) {
    left: var(--offset-left);
  }

  :host([data-x-position="center"]) {
    left: 50%;
    transform: translateX(-50%);
  }

  :host([data-x-position="center"]) {
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 600px) {
    :host {
      width: 100%;
    }

    :host([data-x-position="left"]) {
      left: var(--mobile-offset-left);
    }

    :host([data-x-position="right"]) {
      right: var(--mobile-offset-right);
    }

    :host([data-y-position="bottom"]) {
      bottom: var(--mobile-offset-bottom);
    }

    :host([data-y-position="top"]) {
      top: var(--mobile-offset-top);
    }

    :host([data-x-position="center"]) {
      left: var(--mobile-offset-left);
      right: var(--mobile-offset-right);
      transform: none;
    }
  }
`;

export const toastColorStyles = css`
  /* colors */
  :host([data-red-theme="light"]) {
    --normal-bg: #fff;
    --normal-border: hsl(0, 0%, 93%);
    --normal-text: hsl(0, 0%, 43.5%);

    --success-bg: hsl(143, 85%, 96%);
    --success-border: hsl(145, 92%, 87%);
    --success-text: hsl(140, 100%, 27%);

    --info-bg: hsl(208, 100%, 97%);
    --info-border: hsl(221, 91%, 93%);
    --info-text: hsl(210, 92%, 45%);

    --warning-bg: hsl(49, 100%, 97%);
    --warning-border: hsl(49, 91%, 84%);
    --warning-text: hsl(31, 92%, 45%);

    --error-bg: hsl(359, 100%, 97%);
    --error-border: hsl(359, 100%, 94%);
    --error-text: hsl(360, 100%, 45%);
  }

  :host([data-red-theme="dark"]) {
    --normal-bg: #000;
    --normal-bg-hover: hsl(0, 0%, 12%);
    --normal-border: hsl(0, 0%, 20%);
    --normal-border-hover: hsl(0, 0%, 25%);
    --normal-text: hsl(0, 0%, 99%);

    --success-bg: hsl(150, 100%, 6%);
    --success-border: hsl(147, 100%, 12%);
    --success-text: hsl(150, 86%, 65%);

    --info-bg: hsl(215, 100%, 6%);
    --info-border: hsl(223, 43%, 17%);
    --info-text: hsl(216, 87%, 65%);

    --warning-bg: hsl(64, 100%, 6%);
    --warning-border: hsl(60, 100%, 9%);
    --warning-text: hsl(46, 87%, 65%);

    --error-bg: hsl(358, 76%, 10%);
    --error-border: hsl(357, 89%, 16%);
    --error-text: hsl(358, 100%, 81%);
  }

  [data-red-toast] {
    border-radius: 4px;
    padding: 0.35rem 0.75rem;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-width: 1px;
    border-style: solid;
    /* normal, default */
    background: var(--normal-bg);
    color: var(--normal-text);
    border-color: var(--normal-border);
  }

  [data-red-toast][data-type="success"] {
    background: var(--success-bg);
    border-color: var(--success-border);
    color: var(--success-text);
  }

  [data-red-toast][data-type="info"] {
    background: var(--info-bg);
    border-color: var(--info-border);
    color: var(--info-text);
  }

  [data-red-toast][data-type="warning"] {
    background: var(--warning-bg);
    border-color: var(--warning-border);
    color: var(--warning-text);
  }

  [data-red-toast][data-type="error"] {
    background: var(--error-bg);
    border-color: var(--error-border);
    color: var(--error-text);
  }
`;

export const offsetConverter = {
  fromAttribute(value: any | null) {
    if (value === null || value === undefined) return null;

    // Case 1: Check if the value is a number (e.g., "10")
    if (!isNaN(value)) {
      return Number(value); // Convert to number
    }

    // Case 2: Check if the value is a string with units (e.g., "10px", "2rem")
    if (
      typeof value === "string" &&
      /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/.test(value)
    ) {
      return value; // Return as-is
    }

    // Case 3: Check if the value is an object-like string (e.g., "{ top: '10px', right: '20px' }")
    if (
      typeof value === "string" &&
      value.trim().startsWith("{") &&
      value.trim().endsWith("}")
    ) {
      try {
        // Replace single quotes with double quotes and wrap property names in double quotes
        const validJSONString = value
          .replace(/(\w+):\s*'([^']+)'/g, '"$1": "$2"') // Convert to valid JSON
          .replace(/(\w+):\s*([^,}]+)/g, '"$1": "$2"'); // Handle unquoted values

        const parsed = JSON.parse(validJSONString); // Parse into an object
        if (typeof parsed === "object" && parsed !== null) {
          return parsed; // Return the parsed object
        }
      } catch (err) {
        console.error("Failed to parse object string:", err);
      }
    }

    // If none of the above, return null or a default value
    return null;
  },
  toAttribute(value: any) {
    // Convert the Offset type to a string for the attribute
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  },
};

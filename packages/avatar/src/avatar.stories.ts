import { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

await import(/* @vite-ignore */ import.meta.env.VITE_AVATAR_URL);

const meta = {
  title: "Primitives/Avatar",
  tags: ["autodocs"],
  // argTypes: {
  //
  // },
  render: (_args) => html`
    <avatar-root>
      <avatar-image
        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        alt="Forrest Gump"
      ></avatar-image>
      <avatar-fallback>FG</avatar-fallback>
    </avatar-root>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Basic: Story = {};

/**
 * Delayed fallback waits 600ms before showing the fallback content.
 * This prevents flashing the fallback for images that load quickly.
 */
export const WithDelay: Story = {
  render: () => html`
    <avatar-root delay-ms="600">
      <avatar-image
        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        alt="User Avatar"
      ></avatar-image>
      <avatar-fallback>UA</avatar-fallback>
    </avatar-root>
  `,
};

/**
 * When the image fails to load, the fallback is shown immediately (no delay).
 */
export const WithError: Story = {
  render: () => html`
    <avatar-root delay-ms="600">
      <avatar-image
        src="https://invalid-url-that-will-fail.example.com/avatar.jpg"
        alt="User Avatar"
      ></avatar-image>
      <avatar-fallback>UA</avatar-fallback>
    </avatar-root>
  `,
};

/**
 * CORS settings for cross-origin image requests.
 * Use referrer-policy and cross-origin attributes for security.
 */
export const WithCORS: Story = {
  render: () => html`
    <avatar-root>
      <avatar-image
        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        alt="User Avatar"
        referrer-policy="no-referrer"
        cross-origin="anonymous"
      ></avatar-image>
      <avatar-fallback>UA</avatar-fallback>
    </avatar-root>
  `,
};

/**
 * Loading status change event is fired when the image loading state changes.
 * Open the browser console to see the events.
 */
export const WithLoadingStatusEvent: Story = {
  render: () => html`
    <avatar-root
      @loadingStatusChange=${(e: CustomEvent) => {
        console.log("Loading status changed:", e.detail);
      }}
    >
      <avatar-image
        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        alt="User Avatar"
      ></avatar-image>
      <avatar-fallback>UA</avatar-fallback>
    </avatar-root>
  `,
};

/**
 * Multiple avatars with different delay times
 */
export const MultipleAvatars: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem;">
      <avatar-root delay-ms="0">
        <avatar-image
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
          alt="Avatar 1"
        ></avatar-image>
        <avatar-fallback>A1</avatar-fallback>
      </avatar-root>

      <avatar-root delay-ms="300">
        <avatar-image
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
          alt="Avatar 2"
        ></avatar-image>
        <avatar-fallback>A2</avatar-fallback>
      </avatar-root>

      <avatar-root delay-ms="600">
        <avatar-image
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
          alt="Avatar 3"
        ></avatar-image>
        <avatar-fallback>A3</avatar-fallback>
      </avatar-root>
    </div>
  `,
};

import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './avatar';

const meta = {
    title: 'Primitives/Avatar',
    tags: ['autodocs'],
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

export const Basic: Story = {}

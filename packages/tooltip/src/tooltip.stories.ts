import {Meta, StoryObj} from "@storybook/web-components";
import {html} from "lit";

import "./tooltip";

interface TooltipProps {
    "default-open": boolean;
    open: boolean;
}

const meta = {
    title: "Primitives/Tooltip",
    tags: ['autodocs'],
    render: (_args) => {
        return html`
<tooltip-root >
    <tooltip-trigger>Tooltip trigger</tooltip-trigger>
    <tooltip-content>Content</tooltip-content>
</tooltip-root>
`
    }
} satisfies Meta<TooltipProps>;

export default  meta;
type Story = StoryObj<TooltipProps>;

export const Basic: Story = {
}
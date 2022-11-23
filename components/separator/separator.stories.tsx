import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Separator } from "./separator";

type Story = ComponentStoryObj<typeof Separator>;

const meta: ComponentMeta<typeof Separator> = {
  component: Separator,
};

export const Main: Story = {};

export default meta;

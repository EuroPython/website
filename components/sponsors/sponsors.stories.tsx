import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Sponsors } from "./sponsors";

type Story = ComponentStoryObj<typeof Sponsors>;

const meta: ComponentMeta<typeof Sponsors> = {
  component: Sponsors,
};

export const Main: Story = {};

export default meta;

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Keynoters } from "./keynoters";

type Story = ComponentStoryObj<typeof Keynoters>;

const meta: ComponentMeta<typeof Keynoters> = {
  component: Keynoters,
};

export const Main: Story = {};

export default meta;

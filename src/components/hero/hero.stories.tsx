import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Hero } from "./hero";

type Story = ComponentStoryObj<typeof Hero>;

const meta: ComponentMeta<typeof Hero> = {
  component: Hero,
};

export const Main: Story = {};

export default meta;

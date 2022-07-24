import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Layout } from "./layout";

type Story = ComponentStoryObj<typeof Layout>;

const meta: ComponentMeta<typeof Layout> = {
  component: Layout,
};

export const Main: Story = {
  args: {
    children: <p>Hello world</p>,
  },
};

export default meta;

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Map } from "./map";

type Story = ComponentStoryObj<typeof Map>;

const meta: ComponentMeta<typeof Map> = {
  component: Map,
};

export const Main: Story = {};

export default meta;

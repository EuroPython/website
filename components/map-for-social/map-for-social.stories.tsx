import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { MapSocial } from "./map-for-social";

type Story = ComponentStoryObj<typeof MapSocial>;

const meta: ComponentMeta<typeof MapSocial> = {
  component: MapSocial,
};

export const Main: Story = {};

export default meta;

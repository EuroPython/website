import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { MapSprints } from "./map-for-sprints";

type Story = ComponentStoryObj<typeof MapSprints;

const meta: ComponentMeta<typeof MapSprints> = {
  component: MapSprints,
};

export const Main: Story = {};

export default meta;

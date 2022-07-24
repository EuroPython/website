import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { SponsorTiers } from "./sponsor-tiers";

type Story = ComponentStoryObj<typeof SponsorTiers>;

const meta: ComponentMeta<typeof SponsorTiers> = {
  component: SponsorTiers,
};

export const Main: Story = {};

export default meta;

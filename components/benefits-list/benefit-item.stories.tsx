import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { BenefitItem } from "./benefit-item";

type Story = ComponentStoryObj<typeof BenefitItem>;

const meta: ComponentMeta<typeof BenefitItem> = {
  component: BenefitItem,
};
export const Main: Story = {
  args: {
    title: "Example",
    icon: "network",
    children: "Some text",
  },
};
export default meta;

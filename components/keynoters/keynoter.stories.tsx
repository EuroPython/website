import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Keynoter } from "./keynoter";

type Story = ComponentStoryObj<typeof Keynoter>;

const meta: ComponentMeta<typeof Keynoter> = {
  component: Keynoter,
};

export const Main: Story = {
  args: {
    name: "Raquel Dou",
    tagline: "EPS Chair",
    link: "/raquel-dou",
    picture: "https://i.pravatar.cc/650?u=abc1@example.com",
  },
};

export default meta;

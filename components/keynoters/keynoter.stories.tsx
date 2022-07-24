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
    picture: "https://avatars.dicebear.com/api/adventurer/Pop.svg",
  },
};

export default meta;

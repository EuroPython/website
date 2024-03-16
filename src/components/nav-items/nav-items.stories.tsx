import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { NavItems } from "./nav-items";

type Story = ComponentStoryObj<typeof NavItems>;

const meta: ComponentMeta<typeof NavItems> = {
  component: NavItems,
};

export const Main: Story = {
  args: {
    items: [
      {
        name: "Home",
        path: "/",
      },
    ],
  },
};

export default meta;

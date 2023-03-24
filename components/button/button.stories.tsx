import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Button } from "./button";

type Story = ComponentStoryObj<typeof Button>;

const meta: ComponentMeta<typeof Button> = {
  component: Button,
};
export const Main: Story = {
  args: {
    href: "https://www.example.com",
    children: "Example",
    secondary: false,
  },
};
export const Secondary: Story = {
  args: {
    href: "https://www.example.com",
    children: "Example",
    secondary: true,
  },
};
export default meta;

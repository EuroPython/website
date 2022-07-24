import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { ButtonLink } from "./button-link";

type Story = ComponentStoryObj<typeof ButtonLink>;

const meta: ComponentMeta<typeof ButtonLink> = {
  component: ButtonLink,
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

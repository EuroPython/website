import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { ButtonWithTitle } from "./button-with-title";

type Story = ComponentStoryObj<typeof ButtonWithTitle>;

const meta: ComponentMeta<typeof ButtonWithTitle> = {
  component: ButtonWithTitle,
};
export const Main: Story = {
  args: {
    title: "Example",
    href: "/something",
    text: "Some text",
  },
};
export default meta;

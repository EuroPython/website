import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Note } from "./note";

type Story = ComponentStoryObj<typeof Note>;

const meta: ComponentMeta<typeof Note> = {
  component: Note,
};

export const Main: Story = {
  args: {
    children: "This is a note.",
  },
};

export default meta;

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Datetime } from "./datetime";

type Story = ComponentStoryObj<typeof Datetime>;

const meta: ComponentMeta<typeof Datetime> = {
  component: Datetime,
  render: (args) => {
    args.datetime = new Date(args.datetime);

    return <Datetime {...args} />;
  },

  argTypes: {
    datetime: { control: "date" },
  },
};

export const Main: Story = {
  args: {
    datetime: new Date(),
    format: "HH:mm dd/MM/yyyy",
    useUserTimezone: false,
  },
};

export default meta;

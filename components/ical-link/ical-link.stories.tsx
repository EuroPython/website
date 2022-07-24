import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { ICALLink } from "./ical-link";

type Story = ComponentStoryObj<typeof ICALLink>;

const meta: ComponentMeta<typeof ICALLink> = {
  component: ICALLink,
};

export const Main: Story = {
  args: {
    title: "📆 Example calendar event",
    description: "This is a description of the event.",
    start: "2020-01-01T09:00:00",
    end: "2020-01-01T17:00:00",
    room: "🏢 Example room",
    url: "https://example.com/event",
  },
};

export default meta;

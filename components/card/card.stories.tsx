import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import { Card } from "./card";

type Story = ComponentStoryObj<typeof Card>;

const meta: ComponentMeta<typeof Card> = {
  component: Card,
  decorators: [
    (Story) => (
      <section className="cards">
        <Story />
      </section>
    ),
  ],
};

export const Main: Story = {
  args: {
    title: "Example card",
    subtitle: "A card example",
    content: "Some text",
    url: "/something",
    image: "https://picsum.photos/id/1/600/375",
  },
};

export default meta;

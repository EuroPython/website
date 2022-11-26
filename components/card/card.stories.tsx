import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Card } from "./card";
import { CardContainer } from "./card-container";

export default {
  title: "Card Container",
  component: CardContainer,
  subcomponents: { Card },
} as ComponentMeta<typeof CardContainer>;

export const Main: ComponentStory<typeof CardContainer> = (args) => (
  <CardContainer {...args}>
    <Card
      title="Example card"
      subtitle="A card example"
      content="Some text"
      url="/something"
      image="https://picsum.photos/id/1/600/375"
    />
    <Card
      title="Example card"
      subtitle="A card example"
      content="Some text"
      url="/something"
      image="https://picsum.photos/id/1/600/375"
    />
    <Card
      title="Example card"
      subtitle="A card example"
      content="Some text"
      url="/something"
      image="https://picsum.photos/id/1/600/375"
    />
  </CardContainer>
);

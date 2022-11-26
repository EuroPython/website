import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { ButtonLink } from "components/button-link";

import { HeroVenue } from "./hero-venue";

export default {
  title: "Hero Venue",
  component: HeroVenue,
} as ComponentMeta<typeof HeroVenue>;

export const Main: ComponentStory<typeof HeroVenue> = ({ ...args }) => (
  <HeroVenue {...args}>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
      eligendi sequi sapiente consequuntur aspernatur numquam nam, fuga error
      vitae earum dolores optio quos reprehenderit fugit qui minima! Aut,
      voluptatum labore?
    </p>
  </HeroVenue>
);

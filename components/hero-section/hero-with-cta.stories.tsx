import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { ButtonLink } from "components/button-link";
import { Prose } from "components/prose/prose";
import { Title } from "components/typography/title";

import { HeroWithCTA } from "./hero-with-cta";

export default {
  title: "Hero with CTA",
  component: HeroWithCTA,
} as ComponentMeta<typeof HeroWithCTA>;

export const Main: ComponentStory<typeof HeroWithCTA> = ({
  ctaTitle,
  ctaButton,
  ...args
}) => (
  <HeroWithCTA
    ctaTitle={ctaTitle || "Watch EuroPython Live Streams:"}
    ctaButton={
      ctaButton || (
        <ButtonLink href="https://youtube.com/playlist?list=PL8uoeex94UhFzv6hQ_V02xfMCcl8sUr4p">
          Enjoy the party of Python!
        </ButtonLink>
      )
    }
    {...args}
  >
    <Title>
      EuroPython Dublin
      <br /> You're invited!
    </Title>
    <Prose>
      <p>
        Welcome to the 21st EuroPython. We're the oldest and longest running
        volunteer-led Python programming conference on the planet! Join us in
        July in the beautiful and vibrant city of Dublin. We'll be together,
        face to face and online, to celebrate our shared passion for Python and
        its community!
      </p>
      <p>A week of all things Python:</p>
      <ul>
        <li>
          Monday &amp; Tuesday, 11 &amp; 12 July: Tutorials &amp; Workshops
        </li>
        <li>
          Wednesday–Friday, 13-15 July: Conference talks &amp; sponsor
          exhibition
        </li>
        <li>Saturday &amp; Sunday, 16 &amp; 17 July: Sprints</li>
      </ul>
    </Prose>
  </HeroWithCTA>
);

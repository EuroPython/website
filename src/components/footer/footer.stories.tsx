import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import {
  STORY_DESKTOP_PARAMS,
  STORY_MOBILE_PARAMS,
} from "../../../old/helpers/storybook";

import { Footer } from "./footer";

type Story = ComponentStoryObj<typeof Footer>;

const meta: ComponentMeta<typeof Footer> = {
  component: Footer,
};

export const Desktop: Story = {
  parameters: STORY_DESKTOP_PARAMS,
};

export const Mobile: Story = {
  parameters: STORY_MOBILE_PARAMS,
};

export default meta;

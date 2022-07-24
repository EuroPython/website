import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";

import {
  STORY_DESKTOP_PARAMS,
  STORY_MOBILE_PARAMS,
} from "../../helpers/storybook";

import { Header } from "./header";

type Story = ComponentStoryObj<typeof Header>;

const meta: ComponentMeta<typeof Header> = {
  component: Header,
};

export const Desktop: Story = {
  parameters: STORY_DESKTOP_PARAMS,
};

export const Mobile: Story = {
  parameters: STORY_MOBILE_PARAMS,
};

export default meta;

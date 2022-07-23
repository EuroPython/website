import type { Parameters } from "@storybook/react";

const WIDTH_MOBILE = 320;
const WIDTH_DESKTOP = 1440;

export const STORY_DESKTOP_PARAMS: Parameters = {
  layout: "fullscreen",
  viewport: {
    defaultViewport: "reset",
  },
  chromatic: { viewports: [WIDTH_DESKTOP] },
};

export const STORY_MOBILE_PARAMS: Parameters = {
  layout: "fullscreen",
  viewport: {
    defaultViewport: "mobile1",
  },
  chromatic: { viewports: [WIDTH_MOBILE] },
};

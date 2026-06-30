/**
 * SVGO configuration for SVG optimization.
 *
 * Best-practice defaults:
 * - multipass: runs multiple optimization passes for deeper compression
 * - keep viewBox: essential for responsive/scaling SVGs
 * - keep title/desc: important for accessibility (screen readers)
 */
export default {
  multipass: true,
  plugins: [
    "preset-default",
    {
      name: "removeViewBox",
      active: false,
    },
    {
      name: "removeTitle",
      active: false,
    },
    {
      name: "removeDesc",
      active: false,
    },
  ],
};

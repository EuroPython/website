import { Pane } from "tweakpane";

const Tweaks = () => {
  if (typeof window !== "undefined") {
    const sections = {
      text: [
        "--color-text",
        "--color-text-inverted",
        "--color-body-background",
      ],
      primary: [
        "--color-primary",
        "--color-primary-hover",
        "--color-primary-active",
      ],

      secondary: [
        "--color-secondary",

        "--color-secondary-dark",
        "--color-secondary-darkest",
        "--color-secondary-light",
      ],
      hero: ["--color-hero-primary", "--color-hero-secondary"],
    };

    const pane = new Pane();

    console.log(pane)

    for (const [section, colorVariables] of Object.entries(sections)) {
      // @ts-ignore
      const folder = pane.addFolder({
        title: section,
        // expanded: false,
      });

      console.log(section)

      const params = Object.fromEntries(
        colorVariables.map((variable) => {
          return [
            variable,
            getComputedStyle(document.documentElement)
              .getPropertyValue(variable)
              .trim(),
          ];
        })
      );

      for (const [variable, value] of Object.entries(params)) {
        const label = variable.replace("--color-", "").replace("-", " ");

        // @ts-ignore
        const input = folder.addInput(params, variable, {
          label,
        });

        input.on("change", (ev: { value: string }) => {
          document.documentElement.style.setProperty(variable, ev.value);
        });
      }
    }
  }

  return null;
};

export default Tweaks;

import { Pane } from "tweakpane";

const Tweaks = () => {
  if (typeof window !== "undefined") {
    const colorVariables = [
      "--color-primary",
      "--color-body-background",
      "--color-hero-primary",
      "--color-hero-secondary",
    ];

    const pane = new Pane();

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

      const input = pane.addInput(params, variable, {
        label,
      });

      input.on("change", (ev) => {
        document.documentElement.style.setProperty(variable, ev.value);
      });
    }
  }

  return null;
};

export default Tweaks;

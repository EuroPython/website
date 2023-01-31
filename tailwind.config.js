/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      black: "#000",
      text: "var(--color-text)",
      "text-inverted": "var(--color-text-inverted)",

      "body-inverted": "#001c13",
      "body-background": "var(--color-body-background)",
      "body-light": "#888",

      "hero-primary": "var(--color-hero-primary)",
      "hero-secondary": "var(--color-hero-secondary)",

      primary: "var(--color-primary)",
      "primary-hover": "var(--color-primary-hover)",
      "primary-active": "var(--color-primary-active)",

      secondary: "var(--color-secondary)",
      "secondary-dark": "var(--color-secondary-dark)",
      "secondary-darkest": "var(--color-secondary-darkest)",
      "secondary-light": "var(--color-secondary-light)",

      "session-beginner": "#3dae2b",
      "session-intermediate": "#f7b500",
      "session-advanced": "#ce3333",

      "sponsor-keystone": "#5c9f92",
      "sponsor-diamond": "#568497",
      "sponsor-platinum": "#6b6c6e",
      "sponsor-gold": "#f5c251",
      "sponsor-silver": "#707172",
      "sponsor-bronze": "#6e6151",
      "sponsor-patron": "#a11217",

      red: "#ce3333",
      "keynoter-info": "hsla(0,0%,100%,.85)",
    },
    extend: {
      aspectRatio: {
        hero: "2.4380530973",
      },
      fontFamily: {
        system: ["system-ui", "sans-serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.text"),
            '--tw-prose-headings': theme('colors.white'),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

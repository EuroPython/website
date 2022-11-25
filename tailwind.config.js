/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#fff",
      black: "#000",
      "body-inverted": "#001c13",
      "body-light": "#888",
      "green-300": "#3dae2b",
      "green-500": "#194712",
      "green-800": "#001c13",
      primary: "#f18a00",
      "primary-hover": "#f4a740",
      "primary-active": "#f4a740",
      "secondary-light": "#ecf7ea",
      "session-beginner": "#3dae2b",
      "session-intermediate": "#f7b500",
      "session-advanced": "#ce3333",
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
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

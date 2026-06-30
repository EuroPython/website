import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import sveltePlugin from "eslint-plugin-svelte";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  ...sveltePlugin.configs["flat/recommended"],
  {
    rules: {
      // Astro components often use `Astro` global — no-undef is handled by the plugin
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      // Allow Astro template expressions
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];

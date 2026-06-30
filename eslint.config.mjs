import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import sveltePlugin from "eslint-plugin-svelte";

export default [
  // Base recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  ...sveltePlugin.configs["flat/recommended"],

  // Global overrides for this codebase
  {
    rules: {
      "no-undef": "off",
      "no-var": "warn",
      "no-empty": "warn",
      "no-useless-escape": "warn",
      "no-useless-assignment": "warn",
      // Warnings for issues that don't break functionality
      "no-redeclare": "warn",
      "prefer-const": "warn",
      "preserve-caught-error": "warn",

      // The codebase uses `any` extensively for dynamic API data
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",

      // Allow common patterns in this codebase
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // Astro-specific: CSS-defined vars may not be used in JS
      "astro/no-unused-define-vars-in-style": "off",

      // Unused vars: warn instead of error, allow `_` prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Astro-specific
  {
    files: ["**/*.astro"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // Svelte-specific
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Svelte each blocks without keys — warn instead of error
      "svelte/require-each-key": "warn",
    },
  },

  // Ignored directories
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];

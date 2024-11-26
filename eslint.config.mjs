import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import reactNative from "eslint-plugin-react-native";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Target all JavaScript and TypeScript files
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },

  // Define language options
  {
    languageOptions: {
      parser: tsparser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }, // Enable JSX
        project: "./tsconfig.json", // Specify your TypeScript config file
      },
      globals: globals.browser, // Add browser globals
    },
  },

  // Base JavaScript rules
  pluginJs.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Add type-checked rules

  // React and React Native rules
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-native": reactNative,
      prettier: prettierPlugin, // Add Prettier plugin
    },
    settings: {
      react: { version: "detect" }, // Auto-detect React version
    },
    rules: {
      "react-native/no-unused-styles": "warn", // Warn on unused styles
      "react-native/no-inline-styles": "warn", // Discourage inline styles
      "react-native/no-color-literals": "off", // Allow color literals
      "react-native/split-platform-components": "error", // Enforce platform-specific files
      "react/prop-types": "off", // Disable prop-types for TypeScript
      "react/react-in-jsx-scope": "off", // Not needed for modern React
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }, // Ignore unused variables starting with _
      ],
      "@typescript-eslint/explicit-function-return-type": "off", // Optional return types
      "@typescript-eslint/no-explicit-any": "warn", // Warn on `any` usage
      "@typescript-eslint/no-empty-function": "warn", // Warn on empty functions
      "@typescript-eslint/consistent-type-imports": "warn", // Use `import type` for types

      // Prettier rules
      "prettier/prettier": "warn", // Integrate Prettier for code formatting
    },
    extends: [
      "eslint:recommended", // Base recommended config
      "plugin:react/recommended", // React recommended rules
      "plugin:react-native/all", // React Native recommended rules
      "plugin:@typescript-eslint/recommended", // TypeScript recommended rules
      "prettier", // Disable ESLint rules that conflict with Prettier
      "prettier/react", // Disable Prettier conflicts for React
    ],
  },
];

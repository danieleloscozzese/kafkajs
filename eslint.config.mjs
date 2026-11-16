import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.nodeBuiltin },
  },
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: [
      "**/*.spec.{js,mjs,cjs}",
      "**/__tests__/**/*.{js,mjs,cjs}",
      "testHelpers/**/*.{js,mjs,cjs}",
    ],
    languageOptions: { globals: globals.jest },
  },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    ignores: ["node_modules", "coverage", "*.md", "*.yml", "*.json"],
  },
]);

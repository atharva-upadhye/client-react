import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import _prettierPlugin from "eslint-plugin-prettier";
import _filenameExportPlugin from "eslint-plugin-filename-export";
import { globalIgnores } from "eslint/config";

type ESLintPlugin = {
  rules?: Record<string, unknown>;
};

type PluginWithName<T extends ESLintPlugin, Name extends string> = {
  name: Name;
  plugin: T;
  rule: <RuleName extends keyof T["rules"] & string>(
    rule: RuleName,
  ) => `${Name}/${RuleName}`;
};

function definePlugin<T extends ESLintPlugin, Name extends string>(
  name: Name,
  plugin: T,
): PluginWithName<T, Name> {
  return {
    name,
    plugin,
    rule: (ruleName) => `${name}/${ruleName}` as const,
  };
}

const filenameExportPlugin = definePlugin(
  "filename-export",
  _filenameExportPlugin,
);
const prettierPlugin = definePlugin("prettier", _prettierPlugin);

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.tsx"],
    plugins: {
      [filenameExportPlugin.name]: filenameExportPlugin.plugin,
    },
    rules: {
      [filenameExportPlugin.rule("match-default-export")]: "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      [prettierPlugin.name]: prettierPlugin.plugin,
    },
    rules: {
      // Apply Prettier as an ESLint rule
      [`${prettierPlugin.name}/prettier`]: "warn",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
  },
]);

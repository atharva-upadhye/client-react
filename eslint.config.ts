import _filenameExportPlugin from "eslint-plugin-filename-export";
import _prettierPlugin from "eslint-plugin-prettier";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import vitest from "@vitest/eslint-plugin";

interface ESLintPlugin {
  rules?: Record<string, unknown>;
}

interface PluginWithName<T extends ESLintPlugin, Name extends string> {
  name: Name;
  plugin: T;
  rule: <RuleName extends keyof T["rules"] & string>(
    rule: RuleName,
  ) => `${Name}/${RuleName}`;
}

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
  // tseslint.configs.strictTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [".husky/install.js", ".prettierrc.js"],
        },
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
  },
  {
    plugins: {
      react,
      js,
      reactRefresh,
      reactHooks,
      vitest,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      // "sort-imports": "warn",
    },
  },
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
    plugins: {
      [prettierPlugin.name]: prettierPlugin.plugin,
    },
    rules: {
      // Apply Prettier as an ESLint rule
      [`${prettierPlugin.name}/prettier`]: "warn",
    },
  },
]);

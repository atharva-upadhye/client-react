import filenameExport from "eslint-plugin-filename-export";
import gitignore from "eslint-config-flat-gitignore";
import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
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

const definePlugin = <T extends ESLintPlugin, Name extends string>(
    name: Name,
    plugin: T,
  ): PluginWithName<T, Name> => ({
    name,
    plugin,
    rule: ruleName => `${name}/${ruleName}` as const,
  }),
  filenameExportPlugin = definePlugin("filename-export", filenameExport);

export default tseslint.config([
  gitignore(),
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
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: "module",
    },
    plugins: {
      react,
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
  js.configs.all,
  {
    rules: {
      "capitalized-comments": "off",
      "one-var": "off",
    },
  },
  reactRefresh.configs.vite,
  reactHooks.configs["recommended-latest"],
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.all.rules,
    },
  },
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      prettier,
    },
    rules: {
      // Apply Prettier as an ESLint rule
      "prettier/prettier": "warn",
    },
  },
]);

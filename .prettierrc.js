import * as tailwindPlugin from "prettier-plugin-tailwindcss";
/**
 * @type {import("prettier").Config}
 */
export default {
  arrowParens: "avoid",
  plugins: [tailwindPlugin],
};

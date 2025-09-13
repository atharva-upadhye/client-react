/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-undef */
// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}

// @ts-expect-error await allowed in only modules
const husky = (await import("husky")).default;
console.log(husky());

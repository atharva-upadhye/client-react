// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}

// @ts-expect-error await allowed in only modules
const husky = (await import("husky")).default;
console.log(husky());

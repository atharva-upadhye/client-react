import { type Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{js,mjs,ts,mts,jsx,tsx}': ['eslint --fix --'],
  // '*.m?(j|t)sx?(x)': ['npm run lint --fix --'],
};
export default config;

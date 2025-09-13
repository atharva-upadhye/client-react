/* eslint-disable no-magic-numbers */
export const CONSTANTS = Object.freeze({
  config: {
    api: {
      // retry once on failure
      retry: 1,
      // 5 mins
      staleTime: 1000 * 60 * 5,
    },
  },
});

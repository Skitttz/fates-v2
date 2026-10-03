import { createTV } from 'tailwind-variants';

export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        shadow: [{ shadow: ['brutal', 'brutal-lime', 'brutal-sm'] }],
      },
    },
  },
});

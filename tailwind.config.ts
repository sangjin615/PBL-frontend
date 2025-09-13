import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        primary: 'rgb(var(--color-primary))',
        muted: 'rgb(var(--color-muted))',
      },
    },
  },
  plugins: [],
} satisfies Config;

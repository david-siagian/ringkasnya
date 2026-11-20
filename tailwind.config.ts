import type { Config } from "tailwindcss";

const withAlpha = (cssVar: string) => `rgb(var(${cssVar}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
          900: "#14532d",
        },
        page: withAlpha("--color-bg-page"),
        surface: {
          DEFAULT: withAlpha("--color-bg-surface"),
          subtle: withAlpha("--color-bg-subtle"),
        },
        ink: {
          DEFAULT: withAlpha("--color-text-primary"),
          secondary: withAlpha("--color-text-secondary"),
          muted: withAlpha("--color-text-muted"),
          subtle: withAlpha("--color-text-subtle"),
          faint: withAlpha("--color-text-faint"),
        },
        line: {
          DEFAULT: withAlpha("--color-border-default"),
          subtle: withAlpha("--color-border-subtle"),
          strong: withAlpha("--color-border-strong"),
        },
        accent: {
          soft: withAlpha("--color-accent-soft"),
          tint: withAlpha("--color-accent-tint"),
          text: withAlpha("--color-accent-text"),
          strong: withAlpha("--color-accent-strong"),
          line: withAlpha("--color-accent-line"),
        },
        warm: {
          soft: withAlpha("--color-amber-soft"),
          tint: withAlpha("--color-amber-tint"),
          text: withAlpha("--color-amber-text"),
          heading: withAlpha("--color-amber-heading"),
          line: withAlpha("--color-amber-line"),
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

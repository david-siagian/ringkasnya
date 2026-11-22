import type { Config } from "tailwindcss";

const withAlpha = (cssVar: string) => `rgb(var(${cssVar}) / <alpha-value>)`;

/**
 * Daftar palet warna dinamis untuk `coverGradient` dan `coverAccent` buku
 * yang kini dimuat saat runtime dari Cloudflare D1 sehingga tetap di-generate oleh Tailwind.
 */
const BOOK_COVER_COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const BOOK_COVER_SAFELIST = BOOK_COVER_COLORS.flatMap((color) => [
  // coverGradient (nuansa gelap 800-950)
  `from-${color}-800`,
  `from-${color}-900`,
  `from-${color}-950`,
  `via-${color}-800`,
  `via-${color}-900`,
  `via-${color}-950`,
  `to-${color}-800`,
  `to-${color}-900`,
  `to-${color}-950`,
  // coverAccent (badge kartu buku: mode terang & gelap)
  `bg-${color}-100`,
  `bg-${color}-200`,
  `text-${color}-300`,
  `text-${color}-900`,
  `dark:bg-${color}-800`,
  `dark:bg-${color}-900`,
  `dark:bg-${color}-950/70`,
  `dark:text-${color}-200`,
  `dark:text-${color}-300`,
]);

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,ts,jsx,tsx,mdx}",
  ],
  safelist: BOOK_COVER_SAFELIST,
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

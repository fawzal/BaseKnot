/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas-bg)',
        background: 'var(--background)',
        surface: {
          subtle: 'var(--surface-subtle)',
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
          active: 'var(--border-active)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
          muted: 'var(--foreground-muted)',
          subtle: 'var(--foreground-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          hover: 'var(--accent-hover)',
        },
        tier: {
          research: {
            bg: 'var(--tier-research-bg)',
            text: 'var(--tier-research-text)',
            border: 'var(--tier-research-border)',
            dot: 'var(--tier-research-dot)',
          },
          feature: {
            bg: 'var(--tier-feature-bg)',
            text: 'var(--tier-feature-text)',
            border: 'var(--tier-feature-border)',
            dot: 'var(--tier-feature-dot)',
          },
          sitemap: {
            bg: 'var(--tier-sitemap-bg)',
            text: 'var(--tier-sitemap-text)',
            border: 'var(--tier-sitemap-border)',
            dot: 'var(--tier-sitemap-dot)',
          },
          token: {
            bg: 'var(--tier-token-bg)',
            text: 'var(--tier-token-text)',
            border: 'var(--tier-token-border)',
            dot: 'var(--tier-token-dot)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'node': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'node-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        'dock': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'drawer': '-8px 0 32px -4px rgba(0, 0, 0, 0.12)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'scale-in': {
          from: { transform: 'translate(-50%, -48%) scale(0.96)', opacity: '0' },
          to: { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out forwards',
        'fade-out': 'fade-out 150ms ease-in forwards',
        'scale-in': 'scale-in 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-right': 'slide-out-right 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

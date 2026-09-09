import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./entrypoints/**/*.{html,ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: token('--bg'),
          surface: token('--surface'),
          raised: token('--surface'),
          sidebar: token('--sidebar'),
          muted: token('--tint'),
          border: token('--line'),
          'border-strong': token('--line-strong'),
          ink: token('--ink'),
          text: token('--muted'),
          subtle: token('--subtle'),
          accent: token('--accent'),
          'accent-strong': token('--accent-strong'),
          'accent-soft': token('--tint'),
          button: token('--button'),
          'button-text': token('--button-text'),
          danger: token('--danger'),
          'danger-soft': token('--danger-soft'),
          warning: token('--warning'),
          'warning-soft': token('--warning-soft'),
          info: token('--accent'),
          'info-soft': token('--tint'),
          success: token('--success'),
          'success-soft': token('--success-soft'),
        },
      },
      borderRadius: {
        app: '0.5rem',
        control: '0.375rem',
        lg: '0.5rem',
        overlay: '0.75rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.6875rem', { lineHeight: '1rem' }],
      },
      fontFamily: {
        sans: [
          'Inter Variable',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'IBM Plex Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        overlay: '0 12px 32px rgb(0 0 0 / 0.13)',
        popover: '0 12px 32px rgb(0 0 0 / 0.13)',
      },
    },
  },
  plugins: [],
} satisfies Config;

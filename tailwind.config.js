/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          700: 'var(--brand-700)',
          600: 'var(--brand-600)',
          100: 'var(--brand-100)',
          50: 'var(--brand-50)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
        },
        surface: 'var(--surface)',
        bg: 'var(--bg)',
        line: 'var(--line)',
        warn: {
          DEFAULT: 'var(--warn)',
          bg: 'var(--warn-bg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          bg: 'var(--danger-bg)',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        button: '10px',
        input: '12px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        sheet: '0 -4px 24px -2px rgba(20, 32, 27, 0.12)',
        modal: '0 16px 36px -4px rgba(20, 32, 27, 0.18)',
      },
      minHeight: {
        touch: '48px',
        action: '56px',
      },
    },
  },
  plugins: [],
}

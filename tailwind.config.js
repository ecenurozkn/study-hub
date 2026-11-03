/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Nunito"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        habitz: {
          bg: '#DDD6FE',
          bgSoft: '#E0E7FF',
          coral: '#FDA4AF',
          orange: '#FDBA74',
          mint: '#6EE7B7',
          baby: '#93C5FD',
          purple: '#8B5CF6',
        },
        pastel: {
          mint: '#d1fae5',
          blush: '#ffe4e6',
          baby: '#e0f2fe',
          lilac: '#ede9fe',
          cream: '#f8fafc',
        },
      },
      boxShadow: {
        'habitz': '0 12px 32px -8px rgba(139, 92, 246, 0.12), 0 4px 12px -4px rgba(15, 23, 42, 0.04)',
        'habitz-sm': '0 6px 20px -6px rgba(139, 92, 246, 0.10)',
      },
    },
  },
  plugins: [],
};

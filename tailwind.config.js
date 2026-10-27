/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        pastel: {
          mint: '#d1fae5',
          blush: '#ffe4e6',
          baby: '#e0f2fe',
          lilac: '#ede9fe',
          cream: '#f8fafc',
        },
      },
    },
  },
  plugins: [],
};

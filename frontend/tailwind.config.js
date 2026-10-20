/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        // Strict enforcement: rounded-md (6px) maximum across the entire system
        none: '0px',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
      },
    },
  },
  plugins: [],
}

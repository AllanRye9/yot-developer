import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0f',
        card: '#12121a',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        'text-primary': '#e2e8f0',
        'text-muted': '#64748b',
        border: '#1e1e2e',
        success: '#10b981',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
}
export default config

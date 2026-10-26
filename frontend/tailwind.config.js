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
        background: '#070A0F',
        surface: {
          DEFAULT: '#0B0F19',
          card: '#111827',
          elevated: '#172033',
          border: '#1F293D',
        },
        cyan: {
          glow: '#00F2FE',
          electric: '#00C8FF',
          dark: '#0369A1',
        },
        violet: {
          glow: '#9055FF',
          neon: '#7928CA',
          dark: '#581C87',
        },
        emerald: {
          bright: '#10B981',
          glow: '#34D399',
        },
        amber: {
          hazard: '#F59E0B',
          glow: '#FBBF24',
        },
        rose: {
          alert: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px -5px rgba(0, 242, 254, 0.4)',
        'violet-glow': '0 0 25px -5px rgba(144, 85, 255, 0.4)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'amber-glow': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'beam': 'beam 2s ease-in-out infinite',
      },
      keyframes: {
        beam: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.98)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

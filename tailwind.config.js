/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Mono"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        'rainbow-border': 'rainbowBorder 6s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        rainbowBorder: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        }
      },
      backgroundImage: {
        'rainbow-gradient': 'linear-gradient(270deg, #ff0000, #ff9900, #33cc33, #3399ff, #9900ff, #ff0000)',
      },
    },
  },
  plugins: [],
}

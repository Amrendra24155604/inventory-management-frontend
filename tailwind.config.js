/** @type {import('tailwindcss').Config} */
export default {
   theme: {
    extend: {
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
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
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'rainbow-border': 'rainbowBorder 6s linear infinite',
      },
      keyframes: {
        rainbowBorder: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      
      backgroundImage: {
        'rainbow-gradient': 'linear-gradient(270deg, #ff0000, #ff9900, #33cc33, #3399ff, #9900ff, #ff0000)',
      },
    },
  },
  plugins: [],
  
}
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         "meteor-effect": "meteor 5s linear infinite",
//       },
//       keyframes: {
//         meteor: {
//           "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
//           "70%": { opacity: "1" },
//           "100%": {
//             transform: "rotate(215deg) translateX(-500px)",
//             opacity: "0",
//           },
//         },
//       },
//     },
//   },
// };

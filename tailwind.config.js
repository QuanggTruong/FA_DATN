/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      height: {
        48: "48rem",
      },
      width: {
        110: "28rem",
      },
      colors: {
        gold: {
          50: "#FDFAF3",
          100: "#FBF5E6",
          200: "#F7EBCC",
          400: "#D4AF37",
          600: "#B8860B",
          700: "#996515",
        },
      },
    },
  },
  plugins: [daisyui],
};

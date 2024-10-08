/** @type {import('tailwindcss').Config} */
import { blue } from "@mui/material/colors";
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        colors: {
          primary: {
            // Using MUI primary colors
            light: blue["200"], // Example for light shade
            DEFAULT: blue["500"], // Example for default shade
            dark: blue["700"], // Example for dark shade
          },
        },
      },
    },
  },
  plugins: [scrollbarHide],
};

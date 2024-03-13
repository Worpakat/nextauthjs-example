import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    
    extend: {
      colors: {
        mainBG: '#ecfcfc',
        primary: '#C5FFF8', // Light blue
        accent: {
          light: '#96EFFF', // Lighter blue
          DEFAULT: '#5FBDFF', // Medium blue
          dark: '#7B66FF', // Darker blue
        },
  
        dark: { // Dark color palette
          primary: '#002B3A', // Dark navy
          accent: {
            light: '#004362', // Darker blue
            DEFAULT: '#005C8C', // Darkest blue
            dark: '#1C78A5', // Dark medium blue
          },
        },
      },
      
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D9E75",
        primaryDark: "#157C5C",
        primaryLight: "#9FE1CB",
        secondary: "#378ADD",
        secondaryLight: "#B5D4F4",
        accent: "#C27618",
        health: "#1D9E75",
        warning: "#C27618",
        danger: "#dc2626",
        surface: "#ffffff",
        muted: "#F1EFE8",
        page: "#F1EFE8",
        ink: "#10201f",
      },
      boxShadow: {
        soft: "0 16px 38px rgba(16, 32, 31, 0.08)",
        card: "0 10px 28px rgba(16, 32, 31, 0.07)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

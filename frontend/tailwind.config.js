/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f7f5",
          100: "#e8e8e6",
          500: "#0f3d2e",
          600: "#0f3d2e",
          700: "#0a2620",
          900: "#051410",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 61, 46, 0.05)",
        md: "0 4px 6px -1px rgba(15, 61, 46, 0.1)",
        lg: "0 10px 15px -3px rgba(15, 61, 46, 0.1)",
      },
    },
  },
  plugins: [],
};

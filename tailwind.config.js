/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};

export default config;

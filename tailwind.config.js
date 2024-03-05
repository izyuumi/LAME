/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode: "class",
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["wireframe", "black"],
  }
};

export default config;

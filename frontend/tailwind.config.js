/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}



// Script to run TailwindCSS CLI tool for this project
// npx tailwindcss -i ./src/tailwindCSS/Tailwind_Input.css -o ./src/tailwindCSS/Tailwind_Output.css --watch
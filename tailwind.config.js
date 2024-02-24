/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { sans: ['"Poppins", sans-serif'] },
    extend: {
      colors: {
        primaryBgColor: "#F1F7ED",
        bellsBlue: "#3c9ac9",
        hoverBellsBlue: "#3c9aa1",
      },
    },
  },
  plugins: [],
};

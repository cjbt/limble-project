/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      boxShadow: {
        hover: "0px 4px 15px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

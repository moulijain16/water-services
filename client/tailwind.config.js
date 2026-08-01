/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#EAF4F5",
          100: "#CFE6E9",
          400: "#1B8A9E",
          500: "#12727F",
          600: "#0F5C6B",
          700: "#0B4650",
        },
        ink: {
          900: "#111C22",
          700: "#28383F",
          500: "#5B6C73",
          300: "#98A7AC",
        },
        surface: "#F4F8F8",
        danger: "#C13F35",
        warn: "#D6922E",
        ok: "#2F8F5B",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "focus-primary": "0 0 0 4px #1f6a4a33",
      },
      colors: {
        neutral: {
          50: "#f4f5f6",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#595b5d",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          white: {
            6: "transparent",
            10: "#ffffff1a",
            20: "#fff3",
            32: "#ffffff52",
            80: "#fffc",
            88: "#ffffffe0",
            100: "#ffffff",
          },
        },
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#202124",
        },
        navbar: {
          DEFAULT: "#ffffff",
          dark: "#1c1d1f",
        },

        card: {
          DEFAULT: "#f9f9f9",
          dark: "#292a2d", // כרטיסים טיפה בולטים מהרקע
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#333333", // גבולות דקים נוחים
        },
        text: {
          DEFAULT: "#111827",
          dark: "#f5f5f5", // טקסט בהיר־עדין
        },
        muted: {
          DEFAULT: "#6b7280",
          dark: "#b0b0b0", // טקסט משני – אפור־בהיר
        },
        primary: {
          DEFAULT: "#38bdf8",
          dark: "#0ea5e9", // צבע פעולה
        },
      },
    },
  },
  plugins: [],
};

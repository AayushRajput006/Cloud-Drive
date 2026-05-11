/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8f9fa",
        "on-surface": "#191c1d",
        background: "#f8f9fa",
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        secondary: "#4648d4",
        "secondary-container": "#6063ee",
        outline: "#777587",
        "outline-variant": "#c7c4d8",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "on-surface-variant": "#464555",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        "primary-fixed": "#e2dfff",
        "secondary-fixed": "#e1e0ff",
        "tertiary-fixed": "#ffdbcc",
        tertiary: "#7e3000"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        unit: "4px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        gutter: "20px",
        margin: "32px"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        h1: ["Inter", "sans-serif"],
        h2: ["Inter", "sans-serif"],
        h3: ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        h1: ["36px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "500" }]
      }
    }
  },
  plugins: []
};

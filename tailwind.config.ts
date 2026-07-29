import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["SBSansText", "sans-serif"],
      },
      colors: {
        border: "var(--borderDefault)",
        input: "var(--borderDefault)",
        ring: "var(--borderFocus)",
        background: "var(--backgroundBasicDefault)",
        foreground: "var(--textBaseDefault)",
        primary: {
          DEFAULT: "var(--backgroundPrimaryDefault)",
          foreground: "var(--textBaseInverse)",
        },
        secondary: {
          DEFAULT: "var(--backgroundSecondaryDefault)",
          foreground: "var(--textBaseDefault)",
        },
        destructive: {
          DEFAULT: "var(--backgroundTechDanger)",
          foreground: "var(--textBaseInverse)",
        },
        muted: {
          DEFAULT: "var(--backgroundSecondaryDefault)",
          foreground: "var(--textBaseSecondary)",
        },
        accent: {
          DEFAULT: "var(--backgroundLightQuest)",
          foreground: "var(--textBaseDefault)",
        },
        popover: {
          DEFAULT: "var(--backgroundBasicDefault)",
          foreground: "var(--textBaseDefault)",
        },
        card: {
          DEFAULT: "var(--backgroundBasicDefault)",
          foreground: "var(--textBaseDefault)",
        },
        success: "var(--backgroundTechSuccess)",
        warning: "var(--backgroundTechWarning)",
        danger: "var(--backgroundTechDanger)",
        info: "var(--backgroundAccentInfo)",
        sidebar: {
          DEFAULT: "var(--backgroundBasicDefault)",
          foreground: "var(--textBaseSecondary)",
          active: "var(--backgroundPrimaryDefault)",
          hover: "var(--backgroundBasicHover)",
          border: "var(--borderDefault)",
        },
      },
      borderRadius: {
        lg: "var(--controlBorderRadius)",
        md: "calc(var(--controlBorderRadius) - 2px)",
        sm: "calc(var(--controlBorderRadius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

import type { Config } from "tailwindcss";

// Define the configuration for TailwindCSS
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        toffee: {
          "bg-2": "#121212",
          "bg-3": "#202020",
          "bg-additional": "#242424",
          "mine-sharp": "#323232",
          "icon-3": "#B1B1B1",
          "icon-additional": "#939393",
          text: {
            additional: "#B1B1B1",
            sub: "#DDDDDD",
            card: "#DEDFE4",
            accent: "#BC7F44",
            tertiary: "#777777",
            silver: "#B3B3B3",
            gray: "#727272",
          },
        },
        "bg-1": "#000000",
        "bg-2": "#121212",
        "bg-3": "#202020",
        "icon-3": "#B1B1B1",
        "text-sub": "#DDDDDD",
        "text-additional": "#B1B1B1",
        "text-tertiary": "#777777",
        "text-main": "#FFFFFF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      lineHeight: {
        4.5: "18px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "spin-2": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-2": "spin 2s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        hellix: ["Hellix", "sans-serif"],
      },
      backgroundImage: {
        chat: "url('/chat_background.svg')",
        "linear-yellow":
          "linear-gradient(112deg, #C28851 3.31%, #B77536 83.85%)",
        "chat-white": "url('/chat_background_white.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "toffe-gradient":
          "linear-gradient(275deg, #FDCE48 1.02%, #EFA732 24.62%, #E69B33 77.15%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  content: [
    "./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    //consider extended instead of overwriting
    screens: {
      sm: "30rem", //480px
      md: "48rem", //768px
      lg: "64rem", //1024px
      xl: "80rem", //1280px
      xxl: "100rem", //1600px
    },
    colors: {
      bg_black: "#0F0F0F",
      primary: "#1F1F21", //dark grey
      secondary: "#8B9093", //light grey
      white: "#E9E9E9",
      darkGrey: "#8F8F8F", //dark grey, not oficially in figma yet
      dark: "#161616", //not in figma
      grey: "#4E4F53", //another grey
      link: "#4496F6", //blue
      success: "#77B184", //green
      warning: "#E85959", //red
      info: "#B17E30", //yellow
      "calendar-red": "#BE4E4E",
      "calendar-blue": "#4D65BB",
    },
    extend: {
      backgroundImage: {
        "btn-gradient":
          "linear-gradient(90deg, rgba(85, 85, 97, 0.60) 0%, #2F2F33 90%)",
        "bg-gradient":
          "linear-gradient(180deg, rgba(15, 15, 15, 0.00) 0%, #0F0F0F 41.15%)",
      },
      fontFamily: {
        body: "var(--body-font)",
      },
      fontSize: {
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
        display: ["7rem", { lineHeight: "normal", fontWeight: "500" }], //112px 136px == 8.5
        h1: ["3.25rem", { lineHeight: "normal", fontWeight: "500" }], //52px
        h2: ["2rem", { lineHeight: "normal", fontWeight: "500" }], //32px
        h3: ["1.25rem", { lineHeight: "normal", fontWeight: "500" }], //20px
        h4: ["1.25rem", { lineHeight: "normal" }], //20px
        h5: ["1rem", { lineHeight: "normal" }], //16px
        mini: ["0.625rem", { lineHeight: "normal" }], //10px
      },
    },
  },
  plugins: [],
};
export default config;

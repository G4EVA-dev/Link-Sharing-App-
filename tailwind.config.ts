import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        darkGray: 'rgba(51, 51, 51, 1)',
        loginBtnBg: 'rgba(99, 60, 255, 1)',
        inputBorder: 'rgba(217, 217, 217, 1)',
        grey:'#737373',
        purple: '#633CFF',
        bgColor: 'rgba(250, 250, 250, 1)',
        loginBg: 'rgba(255, 255, 255, 1)',
        linkPageCustomizeText: 'rgba(115, 115, 115, 1)',
        btnpurple: 'rgba(99, 60, 255, 1)',
        linkSave: 'rgba(190, 173, 255, 1)',
        saveborder:'rgba(217, 217, 217, 1)',
      },
    },
  },
  plugins: [],
};
export default config;

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
        lightPurple: '#EFEBFF',
        linkGray:'#737373',
        freeCodeCampColor: 'rgba(48, 34, 103, 1)',
        youtubeColor: 'rgba(238, 57, 57, 1)',
        linkedInColor: 'rgba(45, 104, 255, 1)',
        devToColor: 'rgba(51, 51, 51, 1)',
        codeWarColor: 'rgba(138, 26, 80, 1)',
        profileDetails: 'rgba(115, 115, 115, 1)',
        phoneViewBorder: 'rgba(115, 115, 115, 1)',
        buttonHover: '#BEADFF',
      },
      boxShadow: {
        'custom-shadow': '0px 0px 32px 0px rgba(99, 60, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;

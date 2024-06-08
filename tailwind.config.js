/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		colors: {
		  "color-primary": "#1154A3",
		  "color-secondary": "#DA753C",
		  "color-neutrals": "#1B1C1E",
		  "color-body": "#3B3C3F",
		  "color-gray": "#B6B7B9",
		  "color-border": "#D9DADD",
		},
		fontFamily: {
		  poppins: ["Poppins", "sans-serif"],
		},
		fontSize: {
		  sm: ["14px", "18px"],
		  md: ["16px", "20px"],
		  base: ["18px", "24px"],
		  lg: ["20px", "28px"],
		  heading1: ["36px", "48px"],
		},
		boxShadow: {
		  "md": "0 8px 22px 2px rgba(0, 0, 0, 0.12)",
		},
		screens: {
		  "sm": {"max":"640px"},  
		  "md": {"max":"768px"},  
		  "lg": {"max":"1024px"},  
		  "xl": {"max":"1280px"},  
		  "2xl": {"max":"1536px"},
		}
	  },
	},
	plugins: [],
  }
  
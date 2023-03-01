/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./editor/**/*.{js,ts,jsx,tsx}", "./packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        topaz: "rgba(129, 138, 145, 0.6)",
        tuna: "#3a3d43",
        inkblot: "#383e48",
        mako: "#444952",
        gunmetal: "#2d323b",
        "brand-primary": "#3dbfe8",
        "floating-button-blue": "#0085ba",
        "brand-options": "#383e48",
        "options-border-hover": "#818a91",
        "gray-light": "#828b92",
        "control-color": "rgba(255, 255, 255, 0.07)",
        "shuttle-grey": "rgba(94, 100, 111, 0.6)",
        "shuttle-grey-2": "#5e6470",
        "shuttle-grey-3": "rgba(94, 100, 111, 1)"
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: ".brz",
  content: ["./editor/**/*.{js,ts,jsx,tsx}", "./packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        topaz: "rgba(129, 138, 145, 0.6)",
        tuna: "#3a3d43",
        inkblot: "#383e48",
        mako: "#444952",
        gunmetal: "#2d323b",
        "brand-primary": "var(--active-color, #3dbfe8)",
        "floating-button-blue": "#0085ba",
        "brand-options": "#383e48",
        "options-border-hover": "#818a91",
        "gray-light": "var(--light-gray, #828b92)",
        "control-color": "rgba(255, 255, 255, 0.07)",
        "shuttle-grey": "rgba(94, 100, 111, 0.6)",
        "shuttle-grey-2": "#5e6470",
        "shuttle-grey-3": "rgba(94, 100, 111, 1)",

        //
        "option-content-bg": "var(--inputs-bg, #383e48)",
        "option-content-color": "var(--icons-color, #fff)",

        //Right Sidebar Effects colors
        "right-sidebar-item": "var(--icons-color, #fff)",
        "right-sidebar-item-label": "var(--text-labels, #fff)",
        "right-sidebar-item--active": "var(--active-color, #3dbfe8)",
        "right-sidebar-item-border": "var(--borders,#383e48)",
        "right-sidebar-item-border--hover": "var(--active-color,#818a91)"
      }
    }
  },
  plugins: [],
  corePlugins: {
    container: false,
    preflight: false
  }
};

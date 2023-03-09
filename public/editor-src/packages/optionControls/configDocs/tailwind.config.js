module.exports = {
  content: ["../src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand__primary: "var(--active-color, #3dbfe8)",
        "sidebar-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color--hover": "var(--active-color, #3dbfe8)",
        "control-bg": "#383e48",
        "input-color": "var(--primary-white, #ffffff)",
        "input-bg": "var(--primary-dark, #383e48)",
        "input__placeholder-color":
          "var(--input__placeholder-color, rgba(234, 241, 255, 0.2))",
        "toolbar__item--hover--color": "#3dbfe8",
        "color_palette__icon-color":
          "var(--color_palette-border--active, #fff)",
        "color_palette__icon-color--hover": "var(--active-color, #3dbfe8)",
        "popover__tabs-border":
          "var(--popover__tabs-border, rgba(255,255,255, 0.1))",
        "popover__tabs-color": "var(--primary-gray, #828b92);",
        "popover__tabs-color--active": "var(--active-color, #3dbfe8)",
        "popover__tabs-border--active": "var(--active-color, #3dbfe8)",
        "popover__tabs_left-bg":
          "var(--popover__tabs_left-bg, rgba(139,147,154, 0.92))",
        "popover__tabs_left-box-shadow":
          "var(--popover__tabs_left-box-shadow, rgba(0,0,0, 0.5))",
        "popover__tabs_left-color": "var(--popover__tabs_left-color, #ffffff);",
        "popover__tabs_left-color--active": "var(--active-color, #3dbfe8)",
        "popover__tabs_left-bg--active":
          "var(--secondary-dark, rgba(0,0,0, 0.92))"
      },
      fontSize: {
        "options__item-font-size": "13px",
        "toolbar-font-size": "16px",
        "control-font-size": "13px",
        "popover__tabs-font-size": "13px"
      },
      fontFamily: {
        "default-font-family": "nunito, Open Sans, Arial, sans-serif"
      },
      height: {
        "control-height": "30px"
      },
      borderRadius: {
        "control-border-radius": "4px"
      },
      maxWidth: {
        "control__lg-width": "136px",
        "control__md-width": "112px",
        "control__sm-width": "62px"
      },
      borderColor: {
        "color_palette-border": "var(--color_palette-border, #3a3d43)",
        "color_palette-border--active":
          "var(--color_palette-border--active, #fff)",
        brand__primary: "#3dbfe8"
      },
      spacing: {
        "popover__tabs-height": "34px",
        "options__item-padding": "15px"
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

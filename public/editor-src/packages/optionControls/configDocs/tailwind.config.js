module.exports = {
  content: ["../src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand__primary: "var(--active-color, #3dbfe8)",
        "slider__control-bg": "var(--slider__control-bg, #3dbfe8)",
        "slider__control__handle-bg": "var(--slider__control__handle-bg, #fff)",
        "slider__control__handle-box-shadow": "var(--slider__control__handle-box-shadow, rgba(0, 0, 0, 0.45))",
        "slider__control__handle__line-color": "var(--slider__control__handle__line-color, #3dbfe8)",
        "slider__control__handle-border--active": "var(--slider__control__handle-border--active, #57c5f7)",
        "slider__control__handle-box-shadow--active": "var(--slider__control__handle-box-shadow--active, #57c5f7)",
        "slider__control__handle-box-shadow--focus": "var(--slider__control__handle-box-shadow--focus, #96dbfa)",
        "control-bg": "var(--secondary-dark, #383e48)",
        "sidebar-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color--hover": "var(--active-color, #3dbfe8)",
        "control-bg": "var(--secondary-dark, #383e48)",
        "brand__options-border":
          "var(--tertiary-white, rgba(255, 255, 255, 0.1))",
        "picker__input-color": "var(--primary-gray, #828b92)",
        "picker__input-border":
          "var(--tertiary-white, rgba(255, 255, 255, 0.1))",
        "picker__input-color--active": "var(--primary-white, #fff)",
        "multi_input-color": "var(--multi_input-color, #828b92)",
        "multi_input-border":
          "var(--multi_input-border, rgba(255, 255, 255, 0.1))",
        "multi_input-border--hover":
          "var(--multi_input-border--hover, #828b92)",
        "multi_input-border--active": "var(--active-color, #3dbfe8)",
        "multi_input-color--active": "var(--multi_input-color--active, #fff)",
        "control__variant-color": "var(--primary-gray, #fff)",
        "input-color": "var(--primary-white, #ffffff)",
        "input-bg": "var(--primary-dark, #383e48)",
        "input__placeholder-color":
          "var(--input__placeholder-color, rgba(234, 241, 255, 0.2))",
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
          "var(--secondary-dark, rgba(0,0,0, 0.92))",
        "switch-bg": "var(--primary-dark, #383e48)",
        "switch-box-shadow": "var(--switch-box-shadow, rgba(0,0,0, 0.38))",
        "switch__icon-color": "var(--switch__icon-color, rgba(18,20,25, 0.7))",
        "switch__handle-box-shadow":
          "var(--switch__handle-box-shadow, rgba(255,255,255, 0.35))",
        "switch__handle-bg": "var(--switch__handle-bg, #ffffff);",
        "switch__checked-bg": "var(--active-color, #3dbfe8)",
        "switch__handle__line-color":
          "var(--switch__handle__line-color, #34beea);",
        "control-color": "var(--primary-gray, rgba(255, 255, 255, 0.85))",
        "control-color--active": "var(--active-color, #3dbfe8)",
        "left_sidebar__elements__tooltips-bg":
          "var(--left_sidebar__elements__tooltips-bg, #879294)",
        "left_sidebar__elements__tooltips-color":
          "var(--left_sidebar__elements__tooltips-color, #ffffff)",
        "left_sidebar__elements__tooltips-box-shadow":
          "var(--left_sidebar__elements__tooltips-box-shadow, rgba(0,0,1, 0.15))",
        "left_sidebar__elements__tooltips__arrow-border":
          "var(--left_sidebar__elements__tooltips__arrow-border, transparent)",
        "left_sidebar__elements__tooltips__arrow-border-top-color":
          "var(--left_sidebar__elements__tooltips__arrow-border-top-color, #879294)",
        "brand-primary": "var(--active-color, #3dbfe8)",
        topaz: "rgba(129, 138, 145, 0.6)",

        //Right Sidebar Effects colors
        "right-sidebar-item": "white",
        "right-sidebar-item--active": "#3dbfe8",
        "right-sidebar-item-border": "#383e48",
        "right-sidebar-item-border--hover": "#818a91"
      },
      fontSize: {
        "options__item-font-size": "13px",
        "toolbar-font-size": "16px",
        "control-font-size": "13px",
        "popover__tabs-font-size": "13px"
      },
      width: {
        "control__sm-width": "62px",
        "control__md-width": "112px",
        "control__lg-width": "136px"
      },
      fontFamily: {
        "default-font-family": "nunito, Open Sans, Arial, sans-serif"
      },
      letterSpacing: {
        "control-letter-spacing": "0.25px"
      },
      borderRadius: {
        "control-border-radius": "4px",
        "toolbar-font-size": "16px"
      },
      height: {
        "control-height": "30px"
      },
      maxWidth: {
        "control__lg-width": "136px",
        "control__md-width": "112px",
        "control__sm-width": "62px"
      },
      borderColor: {
        "gradient__range__slider__pointer-border": "var(--gradient__range__slider__pointer-border, #fff)",
        "color_palette-border": "var(--color_palette-border, #3a3d43)",
        "color_palette-border--active":
          "var(--color_palette-border--active, #fff)",
        brand__primary: "var(--active-color, #3dbfe8)"
      },
      spacing: {
        "popover__tabs-height": "34px",
        "options__item-padding": "15px",
        "toolbar__item-padding": "13px"
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

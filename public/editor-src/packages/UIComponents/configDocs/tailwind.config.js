/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand__primary: "var(--active-color, #3dbfe8)",
        "slider__control-bg": "var(--slider__control-bg, #3dbfe8)",
        "slider__control__handle-bg": "var(--slider__control__handle-bg, #fff)",
        "slider__control__handle-box-shadow":
          "var(--slider__control__handle-box-shadow, rgba(0, 0, 0, 0.45))",
        "slider__control__handle__line-color":
          "var(--slider__control__handle__line-color, #3dbfe8)",
        "slider__control__handle-border--active":
          "var(--slider__control__handle-border--active, #57c5f7)",
        "slider__control__handle-box-shadow--active":
          "var(--slider__control__handle-box-shadow--active, #57c5f7)",
        "slider__control__handle-box-shadow--focus":
          "var(--slider__control__handle-box-shadow--focus, #96dbfa)",
        "control-bg": "var(--secondary-dark, #383e48)",
        "sidebar-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color": "var(--primary-white, #ffffff)",
        "toolbar__item-color--hover": "var(--active-color, #3dbfe8)",
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
        "popover__tabs_left-color": "var(--popover__tabs_left-color, #ffffff)",
        "popover__tabs_left-color--active": "var(--active-color, #3dbfe8)",
        "popover__tabs_left-bg--active":
          "var(--secondary-dark, rgba(0,0,0, 0.92))",
        "right-sidebar-item": "var(--primary-white, #fff)",
        "right-sidebar-item-label": "var(--primary-gray, #fff)",
        "right-sidebar-item--active": "var(--active-color, #3dbfe8)",
        "right-sidebar-item-border": "var(--tertiary-gray, #383e48)",
        "right-sidebar-item-border--hover": "var(--active-color, #818a91)",
        "switch-bg": "var(--primary-dark, #383e48)",
        "switch-box-shadow": "var(--switch-box-shadow, rgba(0,0,0, 0.38))",
        "switch__icon-color": "var(--switch__icon-color, rgba(18,20,25, 0.7))",
        "switch__handle-box-shadow":
          "var(--switch__handle-box-shadow, rgba(255,255,255, 0.35))",
        "switch__handle-bg": "var(--switch__handle-bg, #ffffff)",
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
        topaz: "rgba(129, 138, 145, 0.6)",
        "another-control-color":
          "var(--primary-gray, rgba(255, 255, 255, 0.85))",
        "bottom_panel__popover__item-color": "var(--secondary-gray, #ffffff)",
        "bottom_panel__popover-border":
          "var(--tertiary-white, rgba(#ffffff, 0.1))",
        "toolbar-bg": "var(--primary-dark, rgba(3, 8, 15, 0.92))",
        "focal_point__upload-bg": "var(--secondary-dark, #2d323b)",
        "focal_point-border": "var(--focal_point-border, #444952)",

        //Right Sidebar Effects colors
        "right-sidebar-item": "white",
        "right-sidebar-item--active": "#3dbfe8",
        "right-sidebar-item-border": "#383e48",
        "right-sidebar-item-border--hover": "#818a91",
        "toolbar-border": "var(--tertiary-white, rgba(255,255,255, 0.15))",
        "toolbar__fonts__add-color": "var(--primary-gray, #818a91)",
        "toolbar__fonts-color--active": "var(--active-color, #3ebfe8)",
        "toolbar__fonts-color": "var(--secondary-gray, #ffffff)",
        "scrollbar__popup__apps-color":
          "var(--tertiary-white, rgba(0,0,0, 0.2))",
        "scrollbar__sidebar-color": "var(--tertiary-white, #3f4652)",
        "options__item-color--hover": "var(--primary-gray, #818a91)",
        "control__reload-button-color--hover": "var(--active-color, #ffffff)",
        "options__control-bg": "var(--primary-dark, #383e48)",
        "control-border": "var(--tertiary-white, rgba(255, 255, 255, 0.07))",

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
        "popover__tabs-font-size": "13px",
        "toolbar__static-font-size": "12px"
      },
      width: {
        "control__sm-width": "62px",
        "control__md-width": "112px",
        "control__lg-width": "136px",
        "toolbar_tooltip__sm-width": "171px",
        "toolbar_tooltip__md-width": "255px",
        "toolbar_tooltip__typo-width": "420px",
        "toolbar_tooltip__typo-width-no-population": "385px"
      },
      fontFamily: {
        "default-font-family": "nunito, Open Sans, Arial, sans-serif"
      },
      letterSpacing: {
        "control-letter-spacing": "0.25px"
      },
      lineHeight: {
        arrow: "15px",
        "control-height": "30px"
      },
      flex: {
        "control__sm-flex": "0 0 62px",
        "control__md-flex": "0 0 112px",
        "control__lg-flex": "0 0 136px"
      },
      margin: {
        "toolbar__arrow-size": "6px"
      },
      borderWidth: {
        "toolbar__arrow-size": "6px"
      },
      minHeight: {
        "control-height": "30px"
      },
      borderRadius: {
        "control-border-radius": "4px",
        "toolbar-font-size": "16px",
        "toolbar-border-radius": "8px",
        "options__control-radius": "4px"
      },
      height: {
        "control-height": "30px",
        arrow: "15px",
        "toolbar__arrow-size-x-2": "12px",
        "options__item-height": "52px",
        "options__control-radius": "4px"
      },
      inset: {
        "toolbar__arrow-size": "6px",
        "toolbar__arrow-size-x-2": "12px",
        spaceBetween: "calc(100% + 6px + 3px)" // 6px is Arrow | 3px is space between target and content
      },
      maxWidth: {
        "control__lg-width": "136px",
        "control__md-width": "112px",
        "control__sm-width": "62px"
      },
      borderColor: {
        "gradient__range__slider__pointer-border":
          "var(--gradient__range__slider__pointer-border, #fff)",
        "color_palette-border": "var(--color_palette-border, #3a3d43)",
        "color_palette-border--active":
          "var(--color_palette-border--active, #fff)",
        brand__options: "var(--brand__options, #383e48)",
        brand__primary: "var(--active-color, #3dbfe8)"
      },
      spacing: {
        "popover__tabs-height": "34px",
        "options__item-padding": "15px",
        "toolbar__item-padding": "13px",
        "control-padding": "0 10px"
      },
      padding: {
        "options__item-padding": "15px"
      },
      backgroundImage: {
        "slider__control__background-image": `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='18px' height='18px' viewBox='0 0 20 20' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3Eslider handle%3C/title%3E%3Cg id='UI-Helpers' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Artboard' fill-rule='nonzero'%3E%3Cg id='slider-handle'%3E%3Ccircle id='Oval' fill='%23FFFFFF' cx='10' cy='10' r='10'%3E%3C/circle%3E%3Cpath d='M6,7 L14,7 L14,8 L6,8 L6,7 Z M6,10 L14,10 L14,11 L6,11 L6,10 Z M6,13 L14,13 L14,14 L6,14 L6,13 Z' id='Combined-Shape' fill='%233DBFE8'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      },
      boxShadow: {
        "slider__control__handle-box-shadow":
          "0 2px 2px var(--slider__control__handle-box-shadow, rgba(0, 0, 0, 0.45))",
        "slider__control__handle-box-shadow--active":
          "0 0 5px var(--slider__control__handle-box-shadow--active, #57c5f7)",
        "popover_tooltips__helper__overlay-box-shadow":
          "0 0 5px 0 var(--popover_tooltips__helper__overlay-box-shadow, rgba(0, 0, 0, 0.5))"
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};

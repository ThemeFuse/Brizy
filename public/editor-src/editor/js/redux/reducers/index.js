import { combineReducers } from "redux";
import historyEnhancer from "./historyEnhancer";
import {
  HYDRATE,
  UPDATE_PAGE,
  UPDATE_GLOBALS,
  UPDATE_UI,
  SET_AJAX
} from "../actionTypes";

// page
export function page(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      return action.page;
    case UPDATE_PAGE:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

// globals

export function globals(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      return action.globals;
    case UPDATE_GLOBALS:
      return {
        ...state,
        [action.projectOrLanguage]: {
          ...state[action.projectOrLanguage],
          [action.key]: action.value
        }
      };
    default:
      return state;
  }
}

// ui

const uiDefault = {
  deviceMode: "desktop",
  leftSidebar: {
    isOpen: false,
    drawerContentType: null
  }
};
export function ui(state = uiDefault, action) {
  switch (action.type) {
    case UPDATE_UI:
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}

const mergeStyles = (oldValue, newValue) => {
  const colorPalette = newValue.colorPalette || oldValue.colorPalette;
  const fontStyles = newValue.fontStyles || oldValue.fontStyles;

  const generatedColorRules = colorPalette.reduce(
    (acc, color) => ({
      ...acc,
      [`${color.id}__color`]: {
        colorHex: color.hex
      },
      [`${color.id}__hoverColor`]: {
        hoverColorHex: color.hex
      },
      [`${color.id}__bg`]: {
        bgColorHex: color.hex
      },
      [`${color.id}__bg2`]: {
        bg2ColorHex: color.hex
      },
      [`${color.id}__hoverBg`]: {
        hoverBgColorHex: color.hex
      },
      [`${color.id}__border`]: {
        borderColorHex: color.hex
      },
      [`${color.id}__hoverBorder`]: {
        hoverBorderColorHex: color.hex
      },
      [`${color.id}__arrowsColor`]: {
        sliderArrowsColorHex: color.hex
      },
      [`${color.id}__dotsColor`]: {
        sliderDotsColorHex: color.hex
      },
      [`${color.id}__boxShadow`]: {
        boxShadowColorHex: color.hex
      },
      [`${color.id}__mobileBg`]: {
        mobileBgColorHex: color.hex
      }
    }),
    {}
  );
  const generatedFontRules = fontStyles.reduce(
    (acc, font) => ({
      ...acc,
      [`${font.id}__fsDesktop`]: {
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontWeight: font.fontWeight,
        lineHeight: font.lineHeight,
        letterSpacing: font.letterSpacing
      },
      [`${font.id}__fsMobile`]: {
        mobileFontSize: font.mobileFontSize,
        mobileFontWeight: font.mobileFontWeight,
        mobileLineHeight: font.mobileLineHeight,
        mobileLetterSpacing: font.mobileLetterSpacing
      }
    }),
    {}
  );
  const rules = {
    ...oldValue.rules,
    ...generatedColorRules,
    ...generatedFontRules
  };

  return {
    colorPalette,
    fontStyles,
    rules
  };
};
const currentSkin = "default";
export function styles(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      const { globals: { project }, styles } = action;
      const globalsStyles =
        (project.styles && project.styles[currentSkin]) || {};

      return mergeStyles(styles, globalsStyles);
    case UPDATE_GLOBALS:
      return action.key === "styles"
        ? mergeStyles(state, action.value[currentSkin])
        : state;
    default:
      return state;
  }
}

export function doingAjax(state = false, action) {
  switch (action.type) {
    case SET_AJAX:
      return action.value;
    default:
      return state;
  }
}

export default historyEnhancer(
  combineReducers({
    page,
    globals,
    ui,
    styles,
    doingAjax
  }),
  ["page", "globals", "styles"]
);

import { produce } from "immer";
import { ElementModel, ModelType } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { DESKTOP } from "visual/utils/responsiveMode";
import { getBreakpoints } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ACTIVE, HOVER, NORMAL } from "../stateMode";
import {
  filterDeviceValues,
  getInitialV,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  removeDuplicateCSSByDevice
} from "./index";
import { AllCSSKeys, CSS, GeneratedCSS } from "./types";
import { replaceHoverAndActive } from "./utils";

export const getCSSObjects = ({
  currentModel,
  model,
  options
}: {
  options: ToolbarItemType[];
  currentModel: ModelType;
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  };
}): CSS => {
  const initialAcc: CSS = {
    desktop: [],
    tablet: [],
    mobile: [],
    hover: [],
    active: []
  };

  const v = getInitialV(currentModel, model);

  return options.reduce<CSS>((acc, option) => {
    const { selector, style, states = [NORMAL], devices = "all" } = option;

    const breakpoints = getBreakpoints(devices);

    if (!breakpoints) {
      return acc;
    }

    if (style) {
      Object.keys(breakpoints).forEach((key) => {
        const breakpoint = key as BreakpointsNames;

        const normalCSS = getNewGeneratesCSSfromStyle({
          v,
          breakpoint,
          option,
          state: NORMAL,
          allCSS: acc
        });

        if (normalCSS) {
          Object.assign(acc, normalCSS);
        }

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            const hoverCSS = getNewGeneratesCSSfromStyle({
              v,
              breakpoint,
              option,
              state: HOVER,
              allCSS: acc
            });

            if (hoverCSS) {
              Object.assign(acc, hoverCSS);
            }
          }

          if (states.includes(ACTIVE)) {
            const activeCSS = getNewGeneratesCSSfromStyle({
              v,
              breakpoint,
              option,
              state: ACTIVE,
              allCSS: acc
            });

            if (activeCSS) {
              Object.assign(acc, activeCSS);
            }
          }
        }
      });
    }

    if (selector && typeof style !== "function") {
      Object.keys(breakpoints).forEach((key) => {
        const breakpoint = key as BreakpointsNames;
        const normalCSS = getNewGeneratesCSSfromSelector({
          v,
          breakpoint,
          option,
          state: NORMAL,
          allCSS: acc
        });

        Object.assign(acc, normalCSS);

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            const hoverCSS = getNewGeneratesCSSfromSelector({
              v,
              breakpoint,
              option,
              state: HOVER,
              allCSS: acc
            });

            Object.assign(acc, hoverCSS);
          }

          if (states.includes(ACTIVE)) {
            const activeCSS = getNewGeneratesCSSfromSelector({
              v,
              breakpoint,
              option,
              state: ACTIVE,
              allCSS: acc
            });

            Object.assign(acc, activeCSS);
          }
        }
      });
    }

    return acc;
  }, initialAcc);
};

// filtering between tablet, mobile, hover and active with desktop
export const filterMergedStylesByDevice = (
  styles: GeneratedCSS<string>
): GeneratedCSS<string> => {
  const filteredByDevicesData = produce(styles, (draft) => {
    const desktopStyle = draft["desktop"];

    Object.keys(draft).forEach((_key) => {
      const key = _key as BreakpointsNames;

      if (key !== "desktop") {
        draft[key] = filterDeviceValues(key, draft[key], desktopStyle);
      }
    });
  });

  return removeDuplicateCSSByDevice(filteredByDevicesData);
};

export const filterStylesByDevice = (data: CSS): CSS =>
  produce(data, (draft) => {
    const desktopData = data[DESKTOP];

    Object.entries(data).forEach(([_key, value]) => {
      const key = _key as AllCSSKeys;

      if (key !== DESKTOP) {
        if (Array.isArray(value) && value.length > 0) {
          const newData = value.map((cssObj) => {
            const [selector, styles] = Object.entries(cssObj)[0];

            const desktopCSSObj = desktopData?.find((dCSSObj) => {
              const [desktopSelector] = Object.entries(dCSSObj)[0];

              return (
                replaceHoverAndActive(selector) ===
                replaceHoverAndActive(desktopSelector)
              );
            });

            if (desktopCSSObj) {
              const [, desktopStyles] = Object.entries(desktopCSSObj)[0];

              const filteredStyles = styles.filter(
                (s) => !desktopStyles.includes(s)
              );

              return { [selector]: filteredStyles };
            }

            return { [selector]: styles };
          });

          draft[key] = newData;
        }
      }
    });
  });

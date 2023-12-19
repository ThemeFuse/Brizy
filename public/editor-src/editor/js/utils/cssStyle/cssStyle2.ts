import produce from "immer";
import { ElementModel } from "visual/component/Elements/Types";
import { reduce as reduceOptions } from "visual/component/Options/types/utils/reduce";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { isEmpty } from "visual/utils/reader/object";
import { isAllT } from "visual/utils/value";
import { getBreakpoints, getCurrentBreakpoints } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ACTIVE, HOVER, NORMAL } from "../stateMode";
import { CSS, GeneratedCSS, OutputStyle, Styles } from "./types";
import {
  addBreakpointsToFilteredCSS,
  concatStyles,
  filterByGroupAndSelector,
  filterDeviceValues,
  getCSSFromCssStyleFunction,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  getUniqueCSS,
  removeDuplicateCSSByDevice,
  selectorHasHover
} from "./utils";

export const filterCSS = (
  defaultCSSObj: CSS,
  rulesCSSObj: CSS,
  customCSSObj: CSS
): OutputStyle => {
  const filteredByDeviceAndSelector = filterByGroupAndSelector(
    defaultCSSObj,
    rulesCSSObj,
    customCSSObj
  );

  const filteredCSS = filterStyles(filteredByDeviceAndSelector);

  const finalCSS = addBreakpointsToFilteredCSS(filteredCSS);

  return finalCSS;
};

export const getCSSObjects = (
  v: ElementModel,
  options: ToolbarItemType[]
): CSS => {
  const initialAcc = {} as CSS;

  if (isEmpty(v)) {
    return initialAcc;
  }

  return options.reduce<CSS>((allCSS, popoverOption) => {
    const newStyles = reduceOptions<CSS>(
      (acc, option) => {
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

              // INFO: active CSS is generated only for desktop because in our components toolbarColor is enabled only for desktop
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

              // INFO: active CSS is generated only for desktop because in our components toolbarColor is enabled only for desktop
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
      },
      allCSS,
      popoverOption
    );

    return Object.assign(allCSS, newStyles);
  }, initialAcc);
};

///// filtering between vd, vs, v
export const filterStyles = (
  styles: [GeneratedCSS<string>, GeneratedCSS<string>, GeneratedCSS<string>]
): [GeneratedCSS<string>, GeneratedCSS<string>, GeneratedCSS<string>] => {
  const [defaultStyles, rulesStyles, customStyles] = styles;

  const newRulesStyles = getUniqueCSS(rulesStyles, defaultStyles);

  let newCustomStyles = getUniqueCSS(customStyles, rulesStyles);

  newCustomStyles = getUniqueCSS(newCustomStyles, defaultStyles);

  return [
    filterStylesByDevice(defaultStyles),
    filterStylesByDevice(newRulesStyles),
    filterStylesByDevice(newCustomStyles)
  ];
};

///// filtering between devices
export const filterStylesByDevice = (
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

///// this function theoretically can be replace for renderStyles
export const generateCSSByStyleSelectors = ({
  v,
  vs,
  vd,
  styles,
  extraStylesData
}: {
  v: ElementModel;
  vs: ElementModel;
  vd: ElementModel;
  styles: Styles;
  extraStylesData?: Record<string, unknown>;
}): OutputStyle => {
  const defaultCSS = getStylesCSS({ v: vd, styles, extraStylesData });
  const rulesCSS = getStylesCSS({ v: vs, styles, extraStylesData });
  const customCSS = getStylesCSS({ v, styles, extraStylesData });

  const filteredByDeviceAndSelector = filterByGroupAndSelector(
    defaultCSS,
    rulesCSS,
    customCSS
  );

  const filteredCSS = filterStyles(filteredByDeviceAndSelector);

  const finalCSS = addBreakpointsToFilteredCSS(filteredCSS);

  return finalCSS;
};

export const getStylesCSS = ({
  v,
  styles,
  extraStylesData
}: {
  v: ElementModel;
  styles: Styles;
  extraStylesData?: Record<string, unknown>;
}): CSS => {
  const allCSS = {} as CSS;

  Object.keys(getCurrentBreakpoints()).forEach((key) => {
    const breakpoint = key as BreakpointsNames;

    Object.entries(styles).forEach(([styleSelector, styleValue]) => {
      const { standart = [], interval = [] } = styleValue;
      const styles = [...standart, ...interval];

      const cssWithoutSelector = styles
        .map((cssStyleFn) =>
          getCSSFromCssStyleFunction({
            v,
            name: cssStyleFn,
            breakpoint,
            state: NORMAL,
            extraStylesData
          })
        )
        .filter(isAllT);

      if (breakpoint === "desktop" && selectorHasHover(styleSelector)) {
        const hoverCssWithoutSelector = standart
          .map((cssStyleFn) => {
            const hoverCSS = getCSSFromCssStyleFunction({
              v,
              name: cssStyleFn,
              breakpoint,
              state: HOVER,
              extraStylesData
            });

            return hoverCSS && !cssWithoutSelector?.includes(hoverCSS)
              ? hoverCSS
              : undefined;
          })
          .filter(isAllT);

        const newHoverCSS = concatStyles({
          data: [
            {
              selector: styleSelector,
              css: hoverCssWithoutSelector.join("")
            }
          ],
          dataKey: HOVER,
          allCSS
        });

        Object.assign(allCSS, newHoverCSS);
      }

      const newCSS = concatStyles({
        data: [
          {
            selector: styleSelector.replace(":hover", ""),
            css: cssWithoutSelector.join("")
          }
        ],
        dataKey: breakpoint,
        allCSS
      });

      Object.assign(allCSS, newCSS);
    });
  });

  return allCSS;
};

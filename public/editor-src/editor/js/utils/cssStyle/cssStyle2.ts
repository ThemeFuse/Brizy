import { produce } from "immer";
import { ElementModel, ModelType } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { DESKTOP } from "visual/utils/responsiveMode";
import { getBreakpoints } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ACTIVE, HOVER, NORMAL, State, mRead } from "../stateMode";
import { AllCSSKeys, CSS, GeneratedCSS } from "./types";
import {
  concatStyles,
  filterDeviceValues,
  getInitialV,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  removeDuplicateCSSByDevice,
  replaceHoverAndActive
} from "./utils";

const createEmptyCSS = (): CSS => ({
  desktop: [],
  tablet: [],
  mobile: [],
  hover: [],
  active: []
});

const shouldAddHoverToNormalCSS = ({
  breakpoint,
  renderContext,
  tabState
}: {
  breakpoint: BreakpointsNames;
  renderContext: RenderType;
  tabState: State;
}): boolean =>
  isEditor(renderContext) && breakpoint === DESKTOP && tabState === HOVER;

const mergeHoverStylesIntoDesktop = (
  allCSS: CSS,
  hoverCSS?: CSS
): CSS | undefined => {
  const hoverData = hoverCSS?.[HOVER];

  if (!hoverData?.length) {
    return undefined;
  }

  const data = hoverData.flatMap((cssObject) => {
    const [selector, styles] = Object.entries(cssObject)[0] ?? [];

    if (!selector || !styles?.length) {
      return [];
    }

    return styles.map((css) => ({
      selector: selector.replace(/:hover/g, ""),
      css
    }));
  });

  if (!data.length) {
    return undefined;
  }

  return concatStyles({
    data,
    dataKey: DESKTOP,
    allCSS
  });
};

export const getCSSObjects = ({
  currentModel,
  model,
  store,
  options,
  renderContext,
  getConfig
}: {
  options: ToolbarItemType[];
  currentModel: ModelType;
  store: Store;
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  };
  renderContext: RenderType;
  getConfig: GetConfig;
}): CSS => {
  const initialAcc = createEmptyCSS();

  const v = getInitialV(currentModel, model);
  const tabState = mRead(model.v.tabsState) ?? NORMAL;

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
          store,
          state: NORMAL,
          allCSS: acc,
          renderContext,
          getConfig
        });

        if (normalCSS) {
          Object.assign(acc, normalCSS);
        }

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            if (
              shouldAddHoverToNormalCSS({
                breakpoint,
                renderContext,
                tabState
              })
            ) {
              const hoverStateCSS = getNewGeneratesCSSfromStyle({
                v,
                breakpoint,
                option,
                store,
                state: HOVER,
                allCSS: createEmptyCSS(),
                renderContext,
                getConfig
              });
              const hoverCSSInDesktop = mergeHoverStylesIntoDesktop(
                acc,
                hoverStateCSS
              );

              if (hoverCSSInDesktop) {
                Object.assign(acc, hoverCSSInDesktop);
              }
            }

            const hoverCSS = getNewGeneratesCSSfromStyle({
              v,
              breakpoint,
              option,
              store,
              state: HOVER,
              allCSS: acc,
              renderContext,
              getConfig
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
              store,
              state: ACTIVE,
              allCSS: acc,
              renderContext,
              getConfig
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
          store,
          state: NORMAL,
          allCSS: acc,
          renderContext,
          getConfig
        });

        Object.assign(acc, normalCSS);

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            if (
              shouldAddHoverToNormalCSS({
                breakpoint,
                renderContext,
                tabState
              })
            ) {
              const hoverStateCSS = getNewGeneratesCSSfromSelector({
                v,
                breakpoint,
                option,
                store,
                state: HOVER,
                allCSS: createEmptyCSS(),
                renderContext,
                getConfig
              });
              const hoverCSSInDesktop = mergeHoverStylesIntoDesktop(
                acc,
                hoverStateCSS
              );

              if (hoverCSSInDesktop) {
                Object.assign(acc, hoverCSSInDesktop);
              }
            }

            const hoverCSS = getNewGeneratesCSSfromSelector({
              v,
              breakpoint,
              option,
              store,
              state: HOVER,
              allCSS: acc,
              renderContext,
              getConfig
            });

            Object.assign(acc, hoverCSS);
          }

          if (states.includes(ACTIVE)) {
            const activeCSS = getNewGeneratesCSSfromSelector({
              v,
              breakpoint,
              option,
              store,
              state: ACTIVE,
              allCSS: acc,
              renderContext,
              getConfig
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

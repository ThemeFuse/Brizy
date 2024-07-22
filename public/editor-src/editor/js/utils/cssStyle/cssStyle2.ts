import { produce } from "immer";
import { ElementModel, ModelType } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { isEmpty } from "visual/utils/reader/object";
import { getBreakpoints } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ACTIVE, HOVER, NORMAL } from "../stateMode";
import {
  checkIfSomeKeyWasChanged,
  filterDeviceValues,
  getCurrentModelFilteredValues,
  getInitialV,
  getNewGeneratesCSSfromSelector,
  getNewGeneratesCSSfromStyle,
  getNewModel,
  removeDuplicateCSSByDevice
} from "./index";
import { CSS, GeneratedCSS } from "./types";

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

  const initialV = getInitialV(currentModel, model);
  const _v = getCurrentModelFilteredValues(currentModel, model);

  if (isEmpty(_v)) {
    return initialAcc;
  }

  return options.reduce<CSS>((acc, option) => {
    const {
      id,
      type,
      selector,
      style,
      states = [NORMAL],
      devices = "all"
    } = option;
    const breakpoints = getBreakpoints(devices);

    if (!breakpoints) {
      return acc;
    }

    if (style) {
      Object.keys(breakpoints).forEach((key) => {
        const breakpoint = key as BreakpointsNames;

        const someKeyWasChanged = checkIfSomeKeyWasChanged({
          id,
          type,
          v: _v,
          breakpoint,
          state: NORMAL
        });

        if (someKeyWasChanged) {
          const v = getNewModel({
            id,
            type,
            breakpoint,
            v: _v,
            model,
            currentModel,
            state: NORMAL
          });

          const normalCSS = getNewGeneratesCSSfromStyle({
            v,
            initialV,
            breakpoint,
            option,
            state: NORMAL,
            allCSS: acc
          });

          if (normalCSS) {
            Object.assign(acc, normalCSS);
          }
        }

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            const someHoverKeyWasChanged = checkIfSomeKeyWasChanged({
              id,
              type,
              v: _v,
              breakpoint,
              state: HOVER
            });

            if (someHoverKeyWasChanged) {
              const v = getNewModel({
                id,
                type,
                breakpoint,
                v: _v,
                model,
                currentModel,
                state: HOVER
              });

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
          }

          if (states.includes(ACTIVE)) {
            const someActiveKeyWasChanged = checkIfSomeKeyWasChanged({
              id,
              type,
              v: _v,
              breakpoint,
              state: ACTIVE
            });

            if (someActiveKeyWasChanged) {
              const v = getNewModel({
                id,
                type,
                breakpoint,
                v: _v,
                model,
                currentModel,
                state: ACTIVE
              });

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
        }
      });
    }

    if (selector && typeof style !== "function") {
      Object.keys(breakpoints).forEach((key) => {
        const breakpoint = key as BreakpointsNames;

        const someKeyWasChanged = checkIfSomeKeyWasChanged({
          id,
          type,
          v: _v,
          breakpoint,
          state: NORMAL
        });

        if (someKeyWasChanged) {
          const v = getNewModel({
            id,
            type,
            breakpoint,
            v: _v,
            model,
            currentModel,
            state: NORMAL
          });

          const normalCSS = getNewGeneratesCSSfromSelector({
            v,
            breakpoint,
            option,
            state: NORMAL,
            allCSS: acc
          });

          Object.assign(acc, normalCSS);
        }

        if (breakpoint === "desktop" && states) {
          if (states.includes(HOVER)) {
            const someHoverKeyWasChanged = checkIfSomeKeyWasChanged({
              id,
              type,
              v: _v,
              breakpoint,
              state: HOVER
            });

            if (someHoverKeyWasChanged) {
              const v = getNewModel({
                id,
                type,
                breakpoint,
                v: _v,
                model,
                currentModel,
                state: HOVER
              });

              const hoverCSS = getNewGeneratesCSSfromSelector({
                v,
                breakpoint,
                option,
                state: HOVER,
                allCSS: acc
              });

              Object.assign(acc, hoverCSS);
            }
          }

          if (states.includes(ACTIVE)) {
            const someActiveKeyWasChanged = checkIfSomeKeyWasChanged({
              id,
              type,
              v: _v,
              breakpoint,
              state: ACTIVE
            });

            if (someActiveKeyWasChanged) {
              const v = getNewModel({
                id,
                type,
                breakpoint,
                v: _v,
                model,
                currentModel,
                state: ACTIVE
              });

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
        }
      });
    }

    return acc;
  }, initialAcc);
};

// filtering between tablet, mobile, hover and active with desktop
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

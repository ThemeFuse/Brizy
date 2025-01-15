import { configIdSelector } from "visual/redux/selectors";
import * as onStyles from "visual/utils/cssStyle";
import {
  addBreakpointForInterval,
  addBreakpointForStandart
} from "visual/utils/cssStyle";
import { DESKTOP } from "visual/utils/devices";
import { isStory } from "visual/utils/models";

export { css, css1 } from "./css/tujur";

export const getDevices = (config) =>
  isStory(config)
    ? {
        desktop: 1500
      }
    : {
        desktop: 1500,
        tablet: 991,
        mobile: 767
      };

const getStates = (config) =>
  isStory(config)
    ? {
        normal: "normal"
      }
    : {
        normal: "normal",
        hover: "hover"
      };

/**
 *
 * @param {Object} param
 * @param {ElementModel} param.v
 * @param {ElementModel} param.vs
 * @param {ElementModel} param.vd
 * @param {string} param.renderContext - provide the render Context "editor" | "view"
 * @param {object} param.styles
 * @param {object} param.store
 * @param {object} [param.props]
 * @return {[string, string, string]}
 */
export function renderStyles({
  v,
  vs,
  vd,
  renderContext,
  styles,
  props,
  store
}) {
  if (
    //TODO: REMOVE. Temporary throw error if renderContext is not provided
    typeof renderContext === "undefined" &&
    process.env.NODE_ENV === "development"
  ) {
    throw new Error("Render context is undefined");
  }
  if (vd) {
    const { defaultCSS, rulesCSS, customCSS } = loopStyles({
      v,
      vs,
      vd,
      renderContext,
      styles,
      props,
      store
    });

    return [defaultCSS, rulesCSS, customCSS];
  } else {
    throw new Error(
      "this should not happen. we must have accidentally omitted some element"
    );
  }
}

function loopStyles({ v, vs, vd, renderContext, styles, store, props }) {
  let outV = "";
  let outVS = "";
  let outVD = "";
  let legacyV = {};
  let legacyVS = {};
  let legacyVD = {};
  let mode = "";
  let legacyByDefault = {};
  const config = configIdSelector(store.getState());
  const devices = getDevices(config);
  const states = getStates(config);

  /* eslint-disable no-unused-vars */
  Object.entries(devices).forEach(function ([device, deviceValue]) {
    Object.entries(states).forEach(function ([state, stateValue]) {
      if (device === "desktop" || state === "normal") {
        Object.entries(styles).forEach(function ([styleKey, styleValue]) {
          Object.entries(styleValue).forEach(function ([
            styleKeyKey,
            styleValueValue
          ]) {
            styleValueValue.forEach(function (currentStyle) {
              const currentStyleArray = currentStyle.split("|||");
              /* eslint-enabled no-unused-vars */
              if (currentStyleArray.length === 2) {
                mode = currentStyleArray[1];
              } else {
                mode = "";
              }

              const styleFn = currentStyleArray[0];

              if (!onStyles[styleFn]) {
                throw `The style function ${styleFn} is missing`;
              }

              const desktopOutV = onStyles[styleFn]({
                v,
                device: DESKTOP,
                state,
                mode,
                props,
                store,
                renderContext
              });

              const desktopOutVS = onStyles[styleFn]({
                v: vs,
                device: DESKTOP,
                state,
                mode,
                props,
                store,
                renderContext
              });

              const desktopOutVD = onStyles[styleFn]({
                v: vd,
                device: DESKTOP,
                state,
                mode,
                props,
                store,
                renderContext
              });

              const currentOutV = onStyles[styleFn]({
                v,
                device,
                state,
                mode,
                props,
                store,
                renderContext
              });

              outV =
                device === DESKTOP
                  ? desktopOutV
                  : currentOutV === desktopOutV && styleKeyKey === "standart"
                    ? ""
                    : currentOutV;

              legacyV = legacyByOut({
                legacy: legacyV,
                out: outV,
                styleKey,
                state,
                device,
                currentStyle
              });

              const currentOutVS = onStyles[styleFn]({
                v: vs,
                device,
                state,
                renderContext,
                mode,
                props,
                store
              });

              outVS =
                device === DESKTOP
                  ? desktopOutVS
                  : currentOutVS === desktopOutVS && styleKeyKey === "standart"
                    ? ""
                    : currentOutVS;

              legacyVS = legacyByOut({
                legacy: legacyVS,
                out: outVS,
                styleKey,
                state,
                device,
                currentStyle
              });

              const currentOutVD = onStyles[styleFn]({
                v: vd,
                device,
                state,
                renderContext,
                mode,
                props,
                store
              });

              outVD =
                device === DESKTOP
                  ? desktopOutVD
                  : currentOutVD === desktopOutVD && styleKeyKey === "standart"
                    ? ""
                    : currentOutVD;

              legacyVD = legacyByOut({
                legacy: legacyVD,
                out: outVD,
                styleKey,
                state,
                device,
                currentStyle
              });
            });
          });
        });
      }
    });
  });

  const defaultCSS = cssOutput({
    v: undefined,
    styles,
    legacy: legacyVD,
    legacyByDefault,
    devices,
    states
  });

  legacyByDefault = legacyVD;
  const rulesCSS = cssOutput({
    v: vs,
    styles,
    legacy: legacyVS,
    legacyByDefault,
    devices,
    states
  });

  legacyByDefault = legacyVS;
  const customCSS = cssOutput({
    v,
    styles,
    legacy: legacyV,
    legacyByDefault,
    devices,
    states
  });

  return { defaultCSS, rulesCSS, customCSS };
}

function cssOutput({ v, styles, legacy, legacyByDefault, devices, states }) {
  let goStandart = "";
  let goInterval = "";
  let gooutStandart = "";
  let gooutInterval = "";
  let goout = "";
  let devicesCounter = 0;
  let standartCss = "";
  let intervalCss = "";

  Object.entries(devices).forEach(function (
    [device, deviceValue],
    deviceKey,
    devicesArray
  ) {
    Object.entries(states).forEach(function ([state, stateValue]) {
      if (legacy[state]) {
        gooutStandart = "";
        gooutInterval = "";

        Object.entries(legacy[state]).forEach(function ([className, type]) {
          goStandart = "";
          goInterval = "";

          Object.entries(type).forEach(function ([typeKey, cssArray]) {
            let go = cssArray[device];

            const previousModelStyle =
              legacyByDefault?.[state]?.[className]?.[typeKey];
            const currentModelStyle = legacy?.[state]?.[className]?.[typeKey];

            if (
              v &&
              JSON.stringify(previousModelStyle) ===
                JSON.stringify(currentModelStyle)
            ) {
              go = "";
            }

            goStandart +=
              styles[className].standart &&
              styles[className].standart.indexOf(typeKey) !== -1 &&
              go !== "" &&
              go !== undefined
                ? go
                : "";

            goInterval +=
              styles[className].interval &&
              styles[className].interval.indexOf(typeKey) !== -1 &&
              go !== "" &&
              go !== undefined
                ? go
                : "";
          });

          let key;
          if (state === "normal") {
            key = `${className.replace(":hover", "")}{`;
          } else {
            key = `${className}{`;
          }

          if (goStandart !== "") {
            gooutStandart += key + goStandart + "}";
          }

          if (goInterval !== "") {
            gooutInterval += key + goInterval + "}";
          }
        });
      }

      if (gooutStandart !== "") {
        standartCss = addBreakpointForStandart(device, state, devices);

        goout += standartCss + gooutStandart + (standartCss !== "" ? "}" : "");
      }

      if (gooutInterval !== "") {
        intervalCss =
          Object.keys(devices).length === 1
            ? ""
            : addBreakpointForInterval(device, devices);

        goout += intervalCss + gooutInterval + (intervalCss !== "" ? "}" : "");
      }
    });

    devicesCounter++;
  });
  return goout;
}

function legacyByOut({ legacy, out, styleKey, state, device, currentStyle }) {
  if (!out) {
    return legacy;
  }

  if (
    state === "hover" &&
    legacy.normal &&
    legacy.normal[styleKey] &&
    legacy.normal[styleKey][currentStyle]
  ) {
    out = legacy.normal[styleKey][currentStyle][DESKTOP] === out ? "" : out;
  }

  // Codul asta era initial pentru a redue CSS intre devices dar el creaza probleme la show on devices
  /* if (
    legacy[state] &&
    legacy[state][styleKey] &&
    legacy[state][styleKey][currentStyle]
  ) {
    out = legacy[state][styleKey][currentStyle][0] === out ? "" : out;
  }*/

  if (legacy[state]) {
    if (legacy[state][styleKey]) {
      if (legacy[state][styleKey][currentStyle]) {
        legacy[state][styleKey][currentStyle][device] = out;
      } else {
        legacy[state][styleKey][currentStyle] = {};
        legacy[state][styleKey][currentStyle][device] = out;
      }
    } else {
      legacy[state][styleKey] = { [currentStyle]: { [device]: out } };
    }
  } else {
    legacy[state] = { [styleKey]: { [currentStyle]: { [device]: out } } };
  }

  return legacy;
}

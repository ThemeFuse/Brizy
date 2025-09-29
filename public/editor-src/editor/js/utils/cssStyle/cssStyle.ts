import { ElementModel } from "visual/component/Elements/Types";
import { isStory } from "visual/providers/EditorModeProvider";
import {
  addBreakpointForInterval,
  addBreakpointForStandart,
  getCssStyleFnAndMode
} from "visual/utils/cssStyle";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import * as _onStyles from "./index";
import {
  AssignStyleData,
  CSSOutputData,
  CSSOutputResult,
  Devices,
  GeneratorCSSObject,
  LoopCases,
  OnStyles,
  OutputStyle,
  RenderStylesData,
  StoryDevices
} from "./types";

export { css, css1 } from "./css/tujur";

const onStyles = _onStyles as unknown as OnStyles;

export const getDevices = (isStory: boolean): Devices | StoryDevices =>
  isStory
    ? {
        desktop: 1500
      }
    : {
        desktop: 1500,
        tablet: 991,
        mobile: 767
      };

const getLoopCases = (isStory: boolean, withHover?: boolean): LoopCases =>
  isStory
    ? [{ device: DESKTOP, state: NORMAL }]
    : [
        { device: DESKTOP, state: NORMAL },
        ...(withHover
          ? ([{ device: DESKTOP, state: HOVER }] as LoopCases)
          : []),
        { device: TABLET, state: NORMAL },
        { device: MOBILE, state: NORMAL }
      ];

export const renderStyles = <T extends ElementModel = ElementModel>(
  data: RenderStylesData<T>
): OutputStyle => {
  if (data.vd) {
    const { defaultCSS, rulesCSS, customCSS } = loopStyles(data);

    return [defaultCSS, rulesCSS, customCSS];
  } else {
    throw new Error(
      "this should not happen. we must have accidentally omitted some element"
    );
  }
};

function loopStyles<T extends ElementModel = ElementModel>({
  v,
  vs,
  vd,
  contexts,
  styles,
  store,
  props
}: RenderStylesData<T>) {
  let customCSS = "";
  let rulesCSS = "";
  let defaultCSS = "";

  const customCSSData: GeneratorCSSObject = {} as GeneratorCSSObject;
  const rulesCSSData: GeneratorCSSObject = {} as GeneratorCSSObject;
  const defaultCSSData: GeneratorCSSObject = {} as GeneratorCSSObject;

  const { renderContext, mode: editorMode, getConfig } = contexts;

  const isStoryMode = isStory(editorMode);

  getLoopCases(isStoryMode).forEach(({ device, state }) => {
    const isDesktop = device === DESKTOP;

    Object.entries(styles).forEach(function ([selector, styleValue]) {
      Object.entries(styleValue).forEach(function ([
        styleKeyKey,
        styleValueValue
      ]) {
        styleValueValue.forEach(function (cssStyleFn) {
          const { styleFn, mode } = getCssStyleFnAndMode(cssStyleFn);

          const desktopCustomCSS = onStyles[styleFn]({
            v,
            device: DESKTOP,
            state,
            mode,
            props,
            store,
            renderContext,
            getConfig
          });

          const desktopRulesCSS = onStyles[styleFn]({
            v: vs,
            device: DESKTOP,
            state,
            mode,
            props,
            store,
            renderContext,
            getConfig
          });

          const desktopDefaultCSS = onStyles[styleFn]({
            v: vd,
            device: DESKTOP,
            state,
            mode,
            props,
            store,
            renderContext,
            getConfig
          });

          const currentCustomCSS = isDesktop
            ? desktopCustomCSS
            : onStyles[styleFn]({
                v,
                device,
                state,
                mode,
                props,
                store,
                renderContext,
                getConfig
              });

          customCSS = isDesktop
            ? desktopCustomCSS
            : currentCustomCSS === desktopCustomCSS &&
                styleKeyKey === "standart"
              ? ""
              : currentCustomCSS;

          assignStyle({
            objToAssign: customCSSData,
            css: customCSS,
            selector,
            state,
            device,
            cssStyleFn
          });

          const currentRulesCSS = isDesktop
            ? desktopRulesCSS
            : onStyles[styleFn]({
                v: vs,
                device,
                state,
                renderContext,
                mode,
                props,
                store,
                getConfig
              });

          rulesCSS = isDesktop
            ? desktopRulesCSS
            : currentRulesCSS === desktopRulesCSS && styleKeyKey === "standart"
              ? ""
              : currentRulesCSS;

          assignStyle({
            objToAssign: rulesCSSData,
            css: rulesCSS,
            selector,
            state,
            device,
            cssStyleFn
          });

          const currentDefaultCSS = isDesktop
            ? desktopDefaultCSS
            : onStyles[styleFn]({
                v: vd,
                device,
                state,
                renderContext,
                mode,
                props,
                store,
                getConfig
              });

          defaultCSS = isDesktop
            ? desktopDefaultCSS
            : currentDefaultCSS === desktopDefaultCSS &&
                styleKeyKey === "standart"
              ? ""
              : currentDefaultCSS;

          assignStyle({
            objToAssign: defaultCSSData,
            css: defaultCSS,
            selector,
            state,
            device,
            cssStyleFn
          });

          // Hover
          // TODO: For the future, we can add the condition "selector.includes(":hover")", but it will need to be tested thoroughly because, at the moment, the tests are failing.
          if (isDesktop) {
            const currentHoverCustomCSS = onStyles[styleFn]({
              v,
              device,
              state: HOVER,
              mode,
              props,
              store,
              renderContext,
              getConfig
            });

            assignStyle({
              objToAssign: customCSSData,
              css: currentHoverCustomCSS,
              selector,
              state: HOVER,
              device,
              cssStyleFn
            });

            const currentHoverRulesCSS = onStyles[styleFn]({
              v: vs,
              device,
              state: HOVER,
              renderContext,
              mode,
              props,
              store,
              getConfig
            });

            if (currentHoverRulesCSS !== currentRulesCSS) {
              assignStyle({
                objToAssign: rulesCSSData,
                css: currentHoverRulesCSS,
                selector,
                state: HOVER,
                device,
                cssStyleFn
              });
            }

            const currentHoverDefaultCSS = onStyles[styleFn]({
              v: vd,
              device,
              state: HOVER,
              renderContext,
              mode,
              props,
              store,
              getConfig
            });

            if (currentHoverDefaultCSS !== currentDefaultCSS) {
              assignStyle({
                objToAssign: defaultCSSData,
                css: currentHoverDefaultCSS,
                selector,
                state: HOVER,
                device,
                cssStyleFn
              });
            }
          }
        });
      });
    });
  });

  const {
    default: finalDefaultCSS,
    rules: finalRulesCSS,
    custom: finalCustomCSS
  } = cssOutput({
    v,
    vs,
    vd,
    styles,
    editorMode,
    cssData: {
      default: defaultCSSData,
      rules: rulesCSSData,
      custom: customCSSData
    }
  });

  return {
    defaultCSS: finalDefaultCSS,
    rulesCSS: finalRulesCSS,
    customCSS: finalCustomCSS
  };
}

function cssOutput<T extends ElementModel = ElementModel>({
  v,
  vs,
  vd,
  styles,
  cssData,
  editorMode
}: CSSOutputData<T>): CSSOutputResult {
  let goStandart = "";
  let goInterval = "";
  let gooutStandart = "";
  let gooutInterval = "";
  let goout = "";
  let standartCss = "";
  let intervalCss = "";

  const result: CSSOutputResult = {} as CSSOutputResult;

  const isStoryMode = isStory(editorMode);
  const devices = getDevices(isStoryMode);
  const loopCases = getLoopCases(isStoryMode, true);

  Object.entries(cssData).forEach(([modelType, currentCSSData]) => {
    goout = "";

    loopCases.forEach(({ device, state }) => {
      gooutStandart = "";
      gooutInterval = "";

      const value =
        modelType === "default"
          ? vd
          : modelType === "rules"
            ? vs
            : modelType === "custom"
              ? v
              : undefined;

      const previousModelCssData =
        modelType === "default"
          ? ({} as GeneratorCSSObject)
          : modelType === "rules"
            ? cssData["default"]
            : modelType === "custom"
              ? cssData["rules"]
              : undefined;

      if (currentCSSData[state]) {
        Object.entries(currentCSSData[state]).forEach(function ([
          className,
          type
        ]) {
          goStandart = "";
          goInterval = "";

          Object.entries(type).forEach(function ([typeKey, cssArray]) {
            let css = cssArray[device];

            const previousModelStyle =
              previousModelCssData?.[state]?.[className]?.[typeKey];
            const currentModelStyle =
              currentCSSData?.[state]?.[className]?.[typeKey];

            if (
              value &&
              JSON.stringify(previousModelStyle) ===
                JSON.stringify(currentModelStyle)
            ) {
              css = "";
            }

            goStandart +=
              styles[className].standart &&
              styles[className].standart?.indexOf(typeKey) !== -1 &&
              css !== "" &&
              css !== undefined
                ? css
                : "";

            goInterval +=
              styles[className].interval &&
              styles[className].interval?.indexOf(typeKey) !== -1 &&
              css !== "" &&
              css !== undefined
                ? css
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

    Object.assign(result, { [modelType]: goout });
  });

  return result;
}

function assignStyle({
  objToAssign,
  css,
  selector,
  state,
  device,
  cssStyleFn
}: AssignStyleData): void {
  if (objToAssign[state]) {
    if (objToAssign[state][selector]) {
      if (objToAssign[state][selector][cssStyleFn]) {
        objToAssign[state][selector][cssStyleFn][device] = css;
      } else {
        objToAssign[state][selector][cssStyleFn] = {};
        objToAssign[state][selector][cssStyleFn][device] = css;
      }
    } else {
      objToAssign[state][selector] = { [cssStyleFn]: { [device]: css } };
    }
  } else {
    objToAssign[state] = { [selector]: { [cssStyleFn]: { [device]: css } } };
  }
}

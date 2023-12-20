import produce from "immer";
import { CSSProperties } from "react";
import _ from "underscore";
import { ElementModel } from "visual/component/Elements/Types";
import {
  getElementModel,
  getOptionModel
} from "visual/component/Options/types/utils/fromElementModel";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import * as cssStyleFunctions from "visual/utils/cssStyle";
import {
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor
} from "visual/utils/cssStyle";
import * as Arr from "visual/utils/reader/array";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { breakpoints, isBreakpointWithMediaQuery } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ResponsiveMode } from "../responsiveMode";
import { ACTIVE, HOVER, NORMAL, State } from "../stateMode";
import { CSSValue } from "../style2/types";
import { MValue, isAllT } from "../value";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBorder } from "./cssStyleBorder";
import {
  AllCSSKeys,
  CSS,
  GeneratedCSS,
  GeneratedCSSItem,
  Option,
  OutputOptionStyle,
  OutputStyle,
  SelectorAndCSSObject
} from "./types";
import { OptionsStyleFunctions } from "./types";

const optionsStyleFunctions: Record<
  OptionsStyleFunctions,
  (d: CSSValue) => string
> = {
  "border-dev": cssStyleBorder,
  "backgroundColor-dev": cssStyleBgColor,
  "colorPicker-dev": cssStyleColor,
  "boxShadow-dev": cssStyleBoxShadow,
  "corners-dev": cssStyleBorderRadius
};

export const getUniqueCSS = (
  candidate: GeneratedCSS<string>,
  compared: GeneratedCSS<string>
): GeneratedCSS<string> => {
  return produce(candidate, (draft) => {
    Object.keys(draft).forEach((_key) => {
      const key = _key as BreakpointsNames;
      if (Obj.hasKey(key, compared)) {
        draft[key] = _.difference(draft[key], compared[key]);
      }
    });
  });
};

export const filterDeviceValues = (
  key: AllCSSKeys,
  styles: string[],
  desktopStyle: string[]
): string[] => {
  return styles
    .map((comparedStyle) => {
      const _comparedStyle = getCSSForCompare(key, comparedStyle);

      return !desktopStyle.includes(_comparedStyle)
        ? isBreakpointWithMediaQuery(key) || key === ACTIVE
          ? // this is 2-nd wrapper classname, will be: "{WRAPPER}}{{WRAPPER}} .your_selector"
            addSameClassNameToIncreaseSpecificity(comparedStyle)
          : comparedStyle
        : undefined;
    })
    .filter(isAllT);
};

export const getCSSForCompare = (key: AllCSSKeys, css: string): string => {
  switch (key) {
    case HOVER:
      return css.replace(":hover", "");
    case ACTIVE:
      return css.replace(".active", "");
  }

  return css;
};

export const addSameClassNameToIncreaseSpecificity = (
  style: string
): string => {
  if (style.includes("&&")) {
    return style.replace("&&", "&&&&");
  }

  if (style.includes("{{WRAPPER}}")) {
    return style.replace("{{WRAPPER}}", "{{WRAPPER}}{{WRAPPER}}");
  }

  return style;
};

export const getSelectorByState = ({
  selector,
  state
}: {
  selector: string;
  state?: State;
}): string => {
  switch (state) {
    case NORMAL:
      return selector;
    case HOVER:
      return `${selector}:hover`;
    case ACTIVE:
      return `${selector}.active`;
  }

  return selector;
};

export const getCSSObjectFromStyle = ({
  v,
  breakpoint,
  option,
  state
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  state?: State;
}): MValue<OutputOptionStyle> => {
  const { id, type, style } = option;

  const model = getOptionModel({ id, type, v, breakpoint, state });

  if (model && typeof style === "function") {
    return style(model);
  }
};

export const getCSSFromSelector = ({
  v,
  breakpoint,
  option,
  state = NORMAL
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  state?: State;
}): MValue<string> => {
  const { id, type } = option;

  const model = getElementModel({ id, type, v, breakpoint, state });

  const cssStyleFunction =
    optionsStyleFunctions?.[type as OptionsStyleFunctions];

  if (!model || typeof cssStyleFunction !== "function") {
    return undefined;
  }

  const style = cssStyleFunction({
    v: model,
    device: breakpoint as ResponsiveMode,
    state
  });

  if (style) {
    return style;
  }
};

export const getCSSByState = ({
  v,
  breakpoint,
  option,
  state
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  state: State;
}): MValue<SelectorAndCSSObject[]> => {
  const { id, type, states = [NORMAL], style, selector } = option;

  if (breakpoint === "desktop" && states.includes(state)) {
    if (style) {
      const hoverModel = getOptionModel({
        id,
        type,
        v,
        breakpoint: "desktop",
        state
      });

      if (hoverModel) {
        const cssHoverObject = style(hoverModel);

        return getSelectorAndCssFromCssObject(cssHoverObject, state);
      }
    }

    if (selector) {
      const hoverModel = getElementModel({
        id,
        type,
        v,
        breakpoint: "desktop",
        state
      });

      const style = optionsStyleFunctions[type as OptionsStyleFunctions]?.({
        v: hoverModel,
        device: breakpoint as ResponsiveMode,
        state
      });

      if (style) {
        const suffix =
          state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";
        const selectors = selector.split(",");

        return selectors.map((selector) => ({
          selector: `${selector}${suffix}`,
          css: style
        }));
      }
    }
  }
};

export const selectorHasHover = (selector: string): boolean =>
  selector.includes(":hover");

export const getCssStyleFnNameAndMode = (
  name: string
): { fnName: string; mode: string } => {
  const [fnName = "", mode = ""] = name.split("|||");

  return { fnName, mode };
};

export const getCSSFromCssStyleFunction = ({
  v,
  name,
  breakpoint = "desktop",
  state = NORMAL,
  extraStylesData = {}
}: {
  v: ElementModel;
  name: string;
  breakpoint: BreakpointsNames;
  state: State;
  extraStylesData?: Record<string, unknown>;
}): MValue<string> => {
  const styleFunctions = Obj.readNoArray(cssStyleFunctions);

  if (styleFunctions) {
    const { fnName, mode } = getCssStyleFnNameAndMode(name);
    const fn = styleFunctions?.[fnName];

    if (typeof fn === "function") {
      return fn({ v, device: breakpoint, state, mode, props: extraStylesData });
    }
  }
};

export const addBreakpointsToCSS = (
  breakpoint: AllCSSKeys,
  css: string
): string => {
  const { widescreen, desktopLarge, tablet, mobileLandscape, mobile } =
    breakpoints;

  switch (breakpoint) {
    case "widescreen":
      return `@media only screen and (min-width: ${widescreen}px){${css}}`;
    case "desktopLarge":
      return `@media only screen and (min-width: ${desktopLarge}px){${css}}`;
    case "desktop":
    case "active":
      return css;
    case "hover":
      return `@media only screen and (min-width: ${tablet + 1}px){${css}}`;
    case "tablet":
      return `@media only screen and (max-width: ${tablet}px) and (min-width: ${
        mobileLandscape + 1
      }px){${css}}`;
    case "mobileLandscape":
      return `@media only screen and (max-width: ${mobileLandscape}px) and (min-width: ${
        mobile + 1
      }px){${css}}`;
    case "mobile":
      return `@media only screen and (max-width: ${mobile}px) {${css}}`;
  }
};

export const objectToCSS = (css: CSSProperties): string => {
  return Object.entries(css)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
};

export const addBreakpointsToFilteredCSS = (
  styles: [GeneratedCSS<string>, GeneratedCSS<string>, GeneratedCSS<string>]
): [string, string, string] => {
  const [defaultCSS, rulesCSS, customCSS] = styles;

  const defaultStyles = concatCSSWithBreakpoints(defaultCSS);
  const rulesStyles = concatCSSWithBreakpoints(rulesCSS);
  const customStyles = concatCSSWithBreakpoints(customCSS);

  return [defaultStyles, rulesStyles, customStyles];
};

export const concatCSSWithBreakpoints = (
  style: GeneratedCSS<string>
): string => {
  let styles = "";

  Object.entries(style).forEach(([key, value]) => {
    if (value && value.length) {
      const breakpoint = key as BreakpointsNames;
      styles += addBreakpointsToCSS(breakpoint, value.join(""));
    }
  });

  return styles;
};

export const removeDuplicateCSSByDevice = (
  styles: GeneratedCSS<string>
): GeneratedCSS<string> => {
  return produce(styles, (draft) => {
    Object.entries(draft).forEach(([_key, value]) => {
      const key = _key as AllCSSKeys;
      draft[key] = [...new Set(value)];
    });
  });
};

export const getSelectorAndCssFromCssObject = (
  cssSelectorObject: OutputOptionStyle,
  state?: State
): SelectorAndCSSObject[] => {
  const suffix = state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  return Object.entries(cssSelectorObject).map(([selector, cssProperties]) => {
    const css = objectToCSS(cssProperties);

    return { selector: selector + suffix, css: css + ";" };
  });
};

export const concatStylesByCssObject = ({
  breakpoint,
  cssObject,
  allCSS,
  state
}: {
  breakpoint: AllCSSKeys;
  cssObject: OutputOptionStyle;
  allCSS: CSS;
  state?: State;
}): CSS => {
  const data = getSelectorAndCssFromCssObject(cssObject, state);

  return concatStyles({ data, dataKey: breakpoint, allCSS });
};

export const concatStyles = ({
  data,
  dataKey,
  allCSS
}: {
  data: SelectorAndCSSObject[];
  dataKey: AllCSSKeys;
  allCSS: CSS;
}): CSS => {
  let newCSS = {
    ...allCSS
  };

  data.forEach((item) => {
    const { selector, css } = item;

    if (!Obj.hasKey(dataKey, newCSS)) {
      newCSS = produce<CSS>(newCSS, (draft) => {
        draft[dataKey] = [];
      });
    }

    const deviceStyles = newCSS[dataKey];

    const candidateIndex = deviceStyles.findIndex(
      (cssObject) => Object.keys(cssObject)[0] === selector
    );

    if (candidateIndex === -1) {
      newCSS = produce(newCSS, (draft) => {
        draft[dataKey].push({ [selector]: [css] });
      });
    } else {
      newCSS = produce(newCSS, (draft) => {
        draft[dataKey][candidateIndex] = {
          [selector]: [...draft[dataKey][candidateIndex][selector], css]
        };
      });
    }
  });

  return newCSS;
};

export const mergeStylesArray = (
  allCSS: GeneratedCSS<GeneratedCSSItem>
): GeneratedCSS<string> => {
  return produce<GeneratedCSS<GeneratedCSSItem>>(allCSS, (draft) => {
    Object.keys(draft).forEach((_breakpointKey) => {
      const breakpointKey = _breakpointKey as keyof GeneratedCSS<string>;

      const styles = draft[breakpointKey]
        .map<MValue<string>>((styleObj) => {
          const css = Object.values(styleObj).flat().join("");

          if (css) {
            return `${Object.keys(styleObj)[0]}{${css}}`;
          }
        })
        .filter(isAllT);

      draft[breakpointKey] = styles as unknown as GeneratedCSSItem[];
    });
  }) as unknown as GeneratedCSS<string>;
};

export const filterStylesByDesktop = (styles: CSS): CSS => {
  return produce(styles, (draft) => {
    const desktopValue = styles["desktop"];
    const hoverStyles = styles[HOVER] ?? [];
    const activeStyles = styles[ACTIVE] ?? [];

    if (hoverStyles.length) {
      hoverStyles.forEach((cssObject, index) => {
        const uniqueCSSObj = filterCSSObjectBetweenCSSObjects(
          desktopValue,
          cssObject,
          HOVER
        );

        if (uniqueCSSObj) {
          draft[HOVER][index] = uniqueCSSObj;
        }
      });
    }

    if (activeStyles.length) {
      activeStyles.forEach((cssObject, index) => {
        const uniqueCSSObj = filterCSSObjectBetweenCSSObjects(
          desktopValue,
          cssObject,
          ACTIVE
        );

        if (uniqueCSSObj) {
          draft[ACTIVE][index] = uniqueCSSObj;
        }
      });
    }
  });
};

export const filterBySelector = (styles: CSS, compared: CSS): CSS => {
  return produce(styles, (draft) => {
    Object.entries(styles).forEach(([_breakpoint, breakpointValue]) => {
      const breakpoint = _breakpoint as keyof CSS;
      if (Obj.hasKey(breakpoint, compared)) {
        const breakpointArrValue = compared[breakpoint];

        breakpointValue.forEach((cssObject, index) => {
          const uniqueCSSObj = filterCSSObjectBetweenCSSObjects(
            breakpointArrValue,
            cssObject
          );

          if (uniqueCSSObj) {
            draft[breakpoint][index] = uniqueCSSObj;
          }
        });
      }
    });
  });
};

export const filterByGroupAndSelector = (
  defaultStyles: CSS,
  rulesStyles: CSS,
  customStyles: CSS
): [GeneratedCSS<string>, GeneratedCSS<string>, GeneratedCSS<string>] => {
  const newDefaultStyles = filterStylesByDesktop(defaultStyles);
  const newRulesStyles = filterBySelector(rulesStyles, defaultStyles);
  let newCustomStyles = filterBySelector(customStyles, rulesStyles);
  newCustomStyles = filterBySelector(newCustomStyles, defaultStyles);

  return [
    mergeStylesArray(newDefaultStyles),
    mergeStylesArray(newRulesStyles),
    mergeStylesArray(newCustomStyles)
  ];
};

export const concatFinalCSS = (
  styles: OutputStyle,
  toolbarStyles: OutputStyle
): OutputStyle => [
  styles[0] + toolbarStyles[0],
  styles[1] + toolbarStyles[1],
  styles[2] + toolbarStyles[2]
];

export const filterCSSObjectBetweenCSSObjects = (
  compared: GeneratedCSSItem[],
  cssObject: GeneratedCSSItem,
  state?: State
) => {
  const suffix = state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  const [_selector, _cssArr] = Object.entries(cssObject).flat();

  const selector = Str.read(_selector) ?? "";
  const cssArr = Arr.is<string[]>(_cssArr) ? _cssArr : [];

  const desktopCssObjectBySelector = compared.find(
    (cssObj) => Object.keys(cssObj)[0] === selector.replace(suffix, "")
  );

  if (desktopCssObjectBySelector) {
    const defaultCssArr = _.flatten(Object.values(desktopCssObjectBySelector));

    const uniqueCSS = _.difference(cssArr, defaultCssArr);

    return {
      [selector]: uniqueCSS
    };
  }
};

export const getNewGeneratesCSSfromStyle = ({
  v,
  breakpoint,
  option,
  state,
  allCSS
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: ToolbarItemType;
  state: State;
  allCSS: CSS;
}): MValue<CSS> => {
  const cssObject = getCSSObjectFromStyle({ v, breakpoint, option, state });

  const allCSSKey = state === HOVER || state === ACTIVE ? state : breakpoint;

  if (cssObject) {
    return concatStylesByCssObject({
      breakpoint: allCSSKey,
      cssObject,
      allCSS,
      state
    });
  }
};

export const getNewGeneratesCSSfromSelector = ({
  v,
  breakpoint,
  option,
  state,
  allCSS
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: ToolbarItemType;
  state: State;
  allCSS: CSS;
}): MValue<CSS> => {
  const suffix = state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  const css = getCSSFromSelector({ v, breakpoint, option, state });

  if (css) {
    const selectors = option.selector?.split(",");

    const data =
      selectors?.map((selector) => ({
        selector: `${selector}${suffix}`,
        css
      })) ?? [];

    const allCSSKey = state === HOVER || state === ACTIVE ? state : breakpoint;

    return concatStyles({
      data,
      dataKey: allCSSKey,
      allCSS
    });
  }
};

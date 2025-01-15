import { pipe } from "@brizy/readers";
import { produce } from "immer";
import { CSSProperties } from "react";
import { ElementModel, ModelType } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { mPipe } from "visual/utils/fp";
import { getOptionModelWithDesktopDefaults } from "visual/utils/options/utils/fromElementModel";
import {
  getCSSByOptionType,
  isOptionWithStyles,
  normalizeOptionModel
} from "visual/utils/options/utils/toCSS/utils";
import { getOptionMeta } from "visual/utils/options/utils/toMeta/utils";
import * as Bool from "visual/utils/reader/bool";
import * as Obj from "visual/utils/reader/object";
import { filterNullish } from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { breakpoints, isBreakpointWithMediaQuery } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { DESKTOP, MOBILE, ResponsiveMode, TABLET } from "../responsiveMode";
import { ACTIVE, HOVER, NORMAL, State } from "../stateMode";
import { MValue, isAllT, onNullish } from "../value";
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

export const getCSSObjectFromStyle = ({
  v,
  breakpoint,
  option,
  store,
  state = NORMAL,
  renderContext
}: {
  v: ElementModel;
  initialV?: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  store: Store;
  renderContext: RenderType;
  state?: State;
}): MValue<OutputOptionStyle> => {
  const { id, type, style } = option;

  const model = getOptionModelWithDesktopDefaults({
    id,
    type,
    v,
    breakpoint,
    store,
    state
  });

  if (typeof style === "function" && model) {
    const meta = getOptionMeta(type, model);

    const cssObject = style({
      ...(meta && Obj.length(meta) > 0 ? { meta } : {}),
      value: normalizeOptionModel({
        type,
        store,
        optionModel: model,
        extraData: { device: breakpoint, state },
        renderContext
      })
    });

    return cssObject;
  }
};

export const getCSSFromSelector = ({
  v,
  breakpoint,
  option,
  store,
  state = NORMAL,
  renderContext
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  store: Store;
  state?: State;
  renderContext: RenderType;
}): MValue<string> => {
  const { id, type } = option;

  if (isOptionWithStyles(type)) {
    const style = getCSSByOptionType({
      type,
      renderContext,
      data: {
        v,
        device: breakpoint as ResponsiveMode,
        state,
        store,
        id
      }
    });

    if (style) {
      return style;
    }
  }
};

export const addBreakpointsToCSS = (
  breakpoint: AllCSSKeys,
  css: string
): string => {
  const { tablet, mobile } = breakpoints;

  switch (breakpoint) {
    case "desktop":
    case "active":
      return css;
    case "hover":
      return `@media only screen and (min-width: ${tablet + 1}px){${css}}`;
    case "tablet":
      return `@media only screen and (max-width: ${tablet}px) and (min-width: ${
        mobile + 1
      }px){${css}}`;
    case "mobile":
      return `@media only screen and (max-width: ${mobile}px) {${css}}`;
  }
};

export const addBreakpointForStandart = (
  device: ResponsiveMode,
  state: State,
  devices: Record<string, number | undefined>
): string => {
  const tabletWidth = devices[TABLET];
  const mobileWidth = devices[MOBILE];

  if (device === DESKTOP && state === HOVER) {
    return `@media(min-width:${tabletWidth}px){`;
  }

  switch (device) {
    case DESKTOP:
      return "";
    case TABLET:
      return tabletWidth && mobileWidth
        ? `@media(max-width:${tabletWidth}px) and (min-width:${
            mobileWidth + 1
          }px){`
        : "";
    case MOBILE:
      return mobileWidth ? `@media(max-width:${mobileWidth}px){` : "";
  }
};

export const addBreakpointForInterval = (
  device: ResponsiveMode,
  devices: Record<string, number | undefined>
): string => {
  const tabletWidth = devices[TABLET];
  const mobileWidth = devices[MOBILE];

  switch (device) {
    case DESKTOP:
      return `@media(min-width:${tabletWidth}px){`;
    case TABLET:
      return tabletWidth && mobileWidth
        ? `@media(max-width:${tabletWidth}px) and (min-width:${
            mobileWidth + 1
          }px){`
        : "";
    case MOBILE:
      return mobileWidth ? `@media(max-width:${mobileWidth}px){` : "";
  }
};

export const objectToCSS = (css: CSSProperties): string => {
  return Object.entries(css)
    .map(([k, _v]) => {
      // This is case with content:"";
      // prettier-ignore
      const v = _v === "" ? "''" : _v;

      return `${k}:${v}`;
    })
    .join(";");
};

export const addBreakpointsToFilteredCSS = (
  styles: [GeneratedCSS<string>, GeneratedCSS<string>, GeneratedCSS<string>]
): OutputStyle => {
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
  const stateSuffix =
    state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  return Object.entries(cssSelectorObject).map(([_selector, cssProperties]) => {
    const selector =
      state !== HOVER ? _selector.replace(/:hover/g, "") : _selector;
    const css = objectToCSS(cssProperties);

    const selectorSuffix =
      state === HOVER && selector.includes(HOVER) ? "" : stateSuffix;
    const cssSuffix = !css.endsWith(";") ? ";" : "";

    return { selector: selector + selectorSuffix, css: css + cssSuffix };
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

export const concatFinalCSS = (
  styles: OutputStyle,
  toolbarStyles: OutputStyle
): OutputStyle => [
  styles[0] + toolbarStyles[0],
  styles[1] + toolbarStyles[1],
  styles[2] + toolbarStyles[2]
];

const getCss = pipe(
  mPipe(getCSSObjectFromStyle, Obj.read, (d) =>
    filterNullish(d, { empty: true })
  ),
  onNullish({})
);

export const getNewGeneratesCSSfromStyle = ({
  v,
  breakpoint,
  option,
  state,
  store,
  allCSS,
  renderContext
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: ToolbarItemType;
  state: State;
  store: Store;
  allCSS: CSS;
  renderContext: RenderType;
}): MValue<CSS> => {
  const cssObject = getCss({
    v,
    breakpoint,
    option,
    state,
    renderContext,
    store
  });

  if (Obj.length(cssObject) > 0) {
    const allCSSKey = state === HOVER || state === ACTIVE ? state : breakpoint;

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
  store,
  allCSS,
  renderContext
}: {
  v: ElementModel;
  breakpoint: BreakpointsNames;
  option: ToolbarItemType;
  state: State;
  store: Store;
  allCSS: CSS;
  renderContext: RenderType;
}): MValue<CSS> => {
  const suffix = state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  const css = getCSSFromSelector({
    v,
    breakpoint,
    option,
    state,
    store,
    renderContext
  });

  const _selector = Str.read(option.selector);

  if (css && _selector) {
    const selector =
      state !== HOVER ? _selector.replace(/:hover/g, "") : _selector;
    const selectors = selector.split(",");

    const data =
      selectors?.map((selector) => {
        const s = state === HOVER && selector.includes(HOVER) ? "" : suffix;

        return {
          selector: `${selector}${s}`,
          css
        };
      }) ?? [];

    const allCSSKey = state === HOVER || state === ACTIVE ? state : breakpoint;

    return concatStyles({
      data,
      dataKey: allCSSKey,
      allCSS
    });
  }
};

export const getInitialV = <T extends ElementModel = ElementModel>(
  currentModel: ModelType,
  model: {
    vd: T;
    vs: T;
    v: T;
  }
): T => {
  switch (currentModel) {
    case ModelType.Default:
      return model.vd;
    case ModelType.Rules:
      return model.vs;
    case ModelType.Custom:
      return model.v;
  }
};

// compare whole css output from custom and rules with default and replace with empty string if it matched
export const replaceCSSDuplicatesWithEmptyString = (
  data: OutputStyle
): OutputStyle =>
  produce(data, (draft) => {
    if (draft[1] === draft[0]) {
      draft[1] = "";
    }
    if (draft[2] === draft[1] || draft[2] === draft[0]) {
      draft[2] = "";
    }
  });

export const replaceHoverAndActive = (k: string): string =>
  k.replace(/:hover/g, "").replace(/.active/g, "");

export const readTextTransformValue = (
  value: unknown,
  transformKey: string
): string | undefined => {
  // This check is needed because value can came from global styles as var(--varName)
  if (Bool.read(value)) {
    return value ? transformKey : "";
  }

  return Str.read(value);
};

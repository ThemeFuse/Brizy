import { produce } from "immer";
import { CSSProperties } from "react";
import _ from "underscore";
import { ElementModel, ModelType } from "visual/component/Elements/Types";
import { OptionName } from "visual/component/Options/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getOptionModelWithDesktopDefaults } from "visual/utils/options/utils/fromElementModel";
import {
  getCSSByOptionType,
  isOptionWithStyles,
  normalizeOptionModel
} from "visual/utils/options/utils/toCSS/utils";
import { getElementMoldelKeysFromOption } from "visual/utils/options/utils/toElementModel";
import { getOptionMeta } from "visual/utils/options/utils/toMeta/utils";
import * as Obj from "visual/utils/reader/object";
import { diff } from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { breakpoints, isBreakpointWithMediaQuery } from "../breakpoints";
import { BreakpointsNames } from "../breakpoints/types";
import { ResponsiveMode } from "../responsiveMode";
import { ACTIVE, HOVER, NORMAL, State } from "../stateMode";
import { MValue, isAllT } from "../value";
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
  initialV,
  breakpoint,
  option,
  state = NORMAL
}: {
  v: ElementModel;
  initialV?: ElementModel;
  breakpoint: BreakpointsNames;
  option: Option;
  state?: State;
}): MValue<OutputOptionStyle> => {
  const { id, type, style } = option;

  const model = getOptionModelWithDesktopDefaults({
    id,
    type,
    v,
    initialV,
    breakpoint,
    state
  });

  if (typeof style === "function" && model) {
    const meta = getOptionMeta(type, model);

    const cssObject = style({
      ...(meta && Obj.length(meta) > 0 ? { meta } : {}),
      value: normalizeOptionModel({
        type,
        optionModel: model,
        extraData: { device: breakpoint, state }
      })
    });

    return cssObject;
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

  if (isOptionWithStyles(type)) {
    const style = getCSSByOptionType(type, {
      v,
      device: breakpoint as ResponsiveMode,
      state,
      id
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
  const selectorSuffix =
    state === HOVER ? ":hover" : state === ACTIVE ? ".active" : "";

  return Object.entries(cssSelectorObject).map(([selector, cssProperties]) => {
    const css = objectToCSS(cssProperties);

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

export const getNewGeneratesCSSfromStyle = ({
  v,
  initialV,
  breakpoint,
  option,
  state,
  allCSS
}: {
  v: ElementModel;
  initialV?: ElementModel;
  breakpoint: BreakpointsNames;
  option: ToolbarItemType;
  state: State;
  allCSS: CSS;
}): MValue<CSS> => {
  const cssObject = getCSSObjectFromStyle({
    v,
    initialV,
    breakpoint,
    option,
    state
  });

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

export const getMissingKeys = (keys: string[], v: ElementModel): string[] =>
  keys.filter((k) => !Obj.hasKey(k, v));

export const getMissingPropertiesFromModel = (
  keys: string[],
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  },
  currentModel: ModelType
): MValue<ElementModel> => {
  if (currentModel === ModelType.Rules) {
    return keys.reduce((acc: ElementModel, curr) => {
      acc[curr] = model.vd[curr];
      return acc;
    }, {});
  }

  if (currentModel === ModelType.Custom) {
    return keys.reduce((acc: ElementModel, curr) => {
      if (model.vs[curr]) {
        acc[curr] = model.vs[curr];
        return acc;
      }

      acc[curr] = model.vd[curr];

      return acc;
    }, {});
  }
};

export const checkIfSomeKeyWasChanged = ({
  id,
  type,
  v,
  breakpoint,
  state
}: {
  id: string;
  type: OptionName;
  v: ElementModel;
  breakpoint: ResponsiveMode;
  state: State;
}) => {
  const keys = getElementMoldelKeysFromOption({
    id,
    type,
    v,
    device: breakpoint,
    state
  });
  return keys.some((k) => v[k]);
};

export const getNewModel = ({
  id,
  type,
  v,
  model,
  currentModel,
  breakpoint,
  state
}: {
  id: string;
  type: OptionName;
  v: ElementModel;
  breakpoint: BreakpointsNames;
  state: State;
  currentModel: ModelType;
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  };
}) => {
  const keys = getElementMoldelKeysFromOption({
    id,
    type,
    v,
    device: breakpoint,
    state
  });

  const missingKeys = getMissingKeys(keys, v);

  const newModel = getMissingPropertiesFromModel(
    missingKeys,
    model,
    currentModel
  );

  return {
    ...v,
    ...newModel
  };
};

export const getCurrentModelFilteredValues = (
  currentModel: ModelType,
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  }
): ElementModel => {
  const { vd: _vd, vs: _vs, v: _v } = model;
  const vd = _.omit(_vd, "_styles", "_id");
  const vs = _.omit(_vs, "_styles", "_id");
  const v = _.omit(_v, "_styles", "_id");

  switch (currentModel) {
    case ModelType.Default:
      return vd;
    case ModelType.Rules:
      return diff(vd, vs);
    case ModelType.Custom:
      return diff(vs, v);
  }
};

export const getInitialV = (
  currentModel: ModelType,
  model: {
    vd: ElementModel;
    vs: ElementModel;
    v: ElementModel;
  }
): ElementModel => {
  switch (currentModel) {
    case ModelType.Default:
      return model.vd;
    case ModelType.Rules:
      return model.vs;
    case ModelType.Custom:
      return model.v;
  }
};

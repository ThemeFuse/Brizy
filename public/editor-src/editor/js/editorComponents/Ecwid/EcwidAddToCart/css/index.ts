import { Size, getButtonSizes, getSize } from "visual/utils/cssStyle";
import type {
  OptionStyle,
  OutputOptionStyle
} from "visual/utils/cssStyle/types";
import { buttonSelector, iconCartSelector } from "./selectors";

export * from "./selectors";

export const buttonSizeCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => {
  const size = getSize(value);

  if (!size || size === "custom") {
    return {} as OutputOptionStyle;
  }

  const { width = 0, height = 0 } = getButtonSizes(size) ?? {};

  return {
    [buttonSelector]: {
      padding: `${height}px ${width}px`
    }
  };
};

export const getWidthCSSFn =
  (size: Size): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) =>
    size === "custom"
      ? {
          [buttonSelector]: {
            "padding-left": `${value}${unit}`,
            "padding-right": `${value}${unit}`
          }
        }
      : ({} as OutputOptionStyle);

export const getHeightCSSFn =
  (size: Size): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) =>
    size === "custom"
      ? {
          [buttonSelector]: {
            "padding-top": `${value}${unit}`,
            "padding-bottom": `${value}${unit}`
          }
        }
      : ({} as OutputOptionStyle);

export const fillTypeCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => {
  switch (value) {
    case "filled":
      return {} as OutputOptionStyle;
    case "outline":
      return {
        [buttonSelector]: {
          "background-color": "transparent !important"
        }
      };
    case "default":
      return {
        [buttonSelector]: {
          border: "0 !important",
          "background-color": "transparent !important",
          "box-shadow": "none !important"
        }
      };
  }
};

export const borderRadiusCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => {
  if (value === "custom") {
    return {} as OutputOptionStyle;
  }

  switch (value) {
    case "square":
      return {
        [buttonSelector]: {
          "border-radius": 0
        }
      };
    case "rounded":
      return {
        [buttonSelector]: {
          "border-radius": "100px"
        }
      };
  }
};

export const getCustomBorderRadiusCSSFn =
  (borderRadiusType: string): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) =>
    borderRadiusType === "custom"
      ? {
          [buttonSelector]: {
            "border-radius": `${value}${unit}`
          }
        }
      : ({} as OutputOptionStyle);

export const iconPositionCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => ({
  [buttonSelector]: {
    "flex-flow": value === "left" ? "row nowrap" : "row-reverse nowrap"
  }
});

export const iconSizeCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  [iconCartSelector]: {
    "font-size": `${value}${unit}`
  }
});

export const getIconSpacingCSSFn =
  (position: "left" | "right"): OptionStyle<"slider"> =>
  ({ value: { value, unit } }) => {
    switch (position) {
      case "left":
        return {
          [iconCartSelector]: {
            "margin-inline-end": `${value}${unit}`,
            "margin-inline-start": 0
          }
        };
      case "right":
        return {
          [iconCartSelector]: {
            "margin-inline-start": `${value}${unit}`,
            "margin-inline-end": 0
          }
        };
    }
  };

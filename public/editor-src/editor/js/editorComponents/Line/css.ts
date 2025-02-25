import { Base64 } from "js-base64";
import {
  getIconSizeCSS,
  getIconSpacingCSS,
  getStyledLines,
  isDefaultLineType,
  isTypeWithoutWeight,
  readLineAlign
} from "visual/editorComponents/Line/utils";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getColor } from "visual/utils/color";
import type {
  OptionStyle,
  OptionStyleData,
  OutputOptionStyle
} from "visual/utils/cssStyle/types";
import { length as objLength } from "visual/utils/reader/object";
import { read as readString } from "visual/utils/reader/string";

export const lineStyleCSS: OptionStyle<"radioGroup"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}} .brz-line-container:after": {
    display: value === "default" ? "none" : "initial"
  }
});

export const lineTypeCSS = (
  weight: number,
  { value: { value } }: OptionStyleData<"select">
): OutputOptionStyle => {
  const style = readString(value) ?? "";

  if (isDefaultLineType(style)) {
    return {
      "{{WRAPPER}} .brz-hr, {{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after":
        {
          "border-top-style": style
        }
    };
  }

  const _weight = isTypeWithoutWeight(style) ? 1 : weight;
  const svg = getStyledLines(_weight)[style];
  const url = Base64.encode(svg);

  return {
    "{{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after":
      {
        "mask-image": `url("data:image/svg+xml;base64,${url}")`,
        "-webkit-mask-image": `url("data:image/svg+xml;base64,${url}")`,
        border: "none"
      }
  };
};

export const defaultLineHeightCSS: OptionStyle<"slider"> = ({
  value: { value }
}) => ({
  "{{WRAPPER}} .brz-hr, {{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after":
    {
      "border-top-width": `${value}px`
    }
});

export const amountCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after":
    {
      "mask-size": `${value}${unit} 100%`,
      "-webkit-mask-size": `${value}${unit} 100%`
    }
});

export const styledLineHeightCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after":
    {
      "min-height": `${value}${unit};`
    }
});

export const alignCSS: OptionStyle<"radioGroup"> = ({ value: { value } }) => {
  const align = readLineAlign(value);
  const output = {};

  if (align === "left") {
    Object.assign(output, {
      "{{WRAPPER}} .brz-line-container:before": {
        display: "none;"
      }
    });
  }

  if (align === "right") {
    Object.assign(output, {
      "{{WRAPPER}} .brz-line-container:after": {
        display: "none;"
      }
    });
  }

  if (objLength(output) > 0) {
    return output;
  }
};

export const iconSizeCSS: OptionStyle<"radioGroup"> = ({
  value: { value: size }
}) => {
  if (size !== "custom") {
    const css = getIconSizeCSS(size);

    if (css) {
      return {
        "{{WRAPPER}}.brz-line-icon .brz-line-content": {
          "font-size": css + ";"
        }
      };
    }
  }
};

export const iconCustomSizeCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}}.brz-line-icon .brz-line-content": {
    "font-size": `${value}${unit};`
  }
});

export const spacingCSS = (
  align: unknown,
  { value }: OptionStyleData<"slider">
): OutputOptionStyle => ({
  "{{WRAPPER}}.brz-line-text .brz-line-content, {{WRAPPER}} .brz-line-icon-wrapper":
    {
      margin: getIconSpacingCSS(align, value) + ";"
    }
});

export const iconPaddingCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}} .brz-line-icon-wrapper": {
    padding: `${value}${unit}`
  }
});

export const iconRotateCSS: OptionStyle<"slider"> = ({ value: { value } }) => ({
  "{{WRAPPER}}.brz-line-icon .brz-line-content": {
    transform: `rotate(${value}deg);`
  }
});

export const borderColorCSSForDefault =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        "{{WRAPPER}}:hover .brz-hr, {{WRAPPER}}:hover .brz-line-container:before, {{WRAPPER}}:hover .brz-line-container:after":
          {
            "border-top-color": color
          }
      };
    }
  };

export const borderColorCSSForCustom =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        "{{WRAPPER}}:hover .brz-line-container:before, {{WRAPPER}}:hover .brz-line-container:after":
          {
            "background-color": color
          }
      };
    }
  };

export const iconBgColorCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { palette, hex, opacity } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        "{{WRAPPER}}:hover .brz-line-icon-wrapper": {
          "background-color": color
        }
      };
    }
  };

export const widthCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => ({
  "{{WRAPPER}}": {
    width: `${value}${unit || "%"}`
  }
});

export const transitionCSS: OptionStyle<"slider"> = ({ value: { value } }) => ({
  "{{WRAPPER}} .brz-line-icon-wrapper, {{WRAPPER}} .brz-hr, {{WRAPPER}} .brz-line-container:before, {{WRAPPER}} .brz-line-container:after, {{WRAPPER}} .brz-line-content":
    {
      "transition-duration": `0.${value}s`,
      "transition-property":
        "filter, box-shadow, background, border-radius, border-color"
    }
});

export const colorBackgroundCSS =
  (config: ConfigCommon): OptionStyle<"colorPicker"> =>
  ({ value: { opacity, hex, palette } }) => {
    const color = getColor(palette, hex, opacity, config);

    if (color) {
      return {
        "{{WRAPPER}}:hover .brz-line-content": {
          color
        },
        "{{WRAPPER}}:hover .brz-icon-svg-custom": {
          "background-color": color
        }
      };
    }
  };

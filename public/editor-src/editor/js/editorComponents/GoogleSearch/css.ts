import { OptionStyle, OutputOptionStyle } from "visual/utils/cssStyle/types";

export const widthCSS: OptionStyle<"slider"> = ({ value: { value, unit } }) => {
  return {
    "{{WRAPPER}} .brz-google-search-form": {
      width: `${value}${unit}`
    }
  };
};

export const heightCSS: OptionStyle<"slider"> = ({
  value: { value, unit }
}) => {
  if (unit === "%") {
    return {
      "{{WRAPPER}}.brz-google-search-container--minimal:after": {
        content: "",
        display: "block",
        width: 0,
        "padding-top": `${value}${unit}`
      }
    };
  }

  if (unit === "px") {
    return {
      "{{WRAPPER}}.brz-google-search-container--minimal .brz-google-search-form":
        {
          height: `${value}${unit}`
        }
    } as OutputOptionStyle;
  }
};

export const transitionCSS: OptionStyle<"slider"> = ({ value: { value } }) => {
  return {
    "{{WRAPPER}}, {{WRAPPER}} .brz-google-search, {{WRAPPER}} .brz-google-search::placeholder, {{WRAPPER}} .brz-google-search-form .brz-google-search-icon__style1":
      {
        transition: `${value}ms`
      }
  };
};

const aligns = {
  left: "flex-start",
  center: "center",
  right: "flex-end"
};

export const horizontalAlignCSS: OptionStyle<"toggle"> = ({
  value: { value }
}) => {
  return {
    "{{WRAPPER}}": {
      "align-items": aligns[value as keyof typeof aligns]
    }
  };
};

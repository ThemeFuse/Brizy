import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStylePaddingFourFields,
  cssStyleSizeFontSize,
  cssStyleSizeHeight,
  cssStyleSizeWidth,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import {
  styleBorderColor,
  styleBorderStyle,
  styleBorderWidthUngrouped,
  styleElementFiltersActiveColumns,
  styleElementFiltersActiveOrientation,
  styleElementFiltersBtnHeight,
  styleElementFiltersBtnSpacing,
  styleElementFiltersCheckboxColumns,
  styleElementFiltersCheckboxOrientation,
  styleElementFiltersCheckboxShowCounter,
  styleElementFiltersCheckboxType,
  styleElementFiltersCheckColorSize,
  styleElementFiltersDataSource,
  styleElementFiltersDateOptionWidth,
  styleElementFiltersGap,
  styleElementFiltersHierarchicalSpacing,
  styleElementFiltersHorizontalAlignBtn,
  styleElementFiltersHorizontalAlignLabel,
  styleElementFiltersHorizontalAlignOption,
  styleElementFiltersLabelSpacing,
  styleElementFiltersOptionsAlign,
  styleElementFiltersOptionSpacing,
  styleElementFiltersShowApply,
  styleElementFiltersSpacing,
  styleElementFiltersTitleSpacing,
  styleElementFiltersType
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";
import {
  styleBgColor,
  styleBgGradient,
  styleBorderRadiusGrouped,
  styleBorderRadiusType,
  styleBorderRadiusUngrouped,
  styleElementFiltersCheckboxColumnsCustomStyles,
  styleElementFiltersCheckboxOrientationCustomStyles
} from "../style2";
import { cssStylePadding } from "./cssStylePadding";

type MString = MValue<string>;

// Style Typography Options
export function cssStyleElementFiltersSelectOptionTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "selectOption" });
}

export function cssStyleElementFiltersSelectOptionTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "selectOption" });
}

export function cssStyleElementFiltersSelectOptionTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "selectOption" });
}

export function cssStyleElementFiltersSelectOptionTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "selectOption" });
}

export function cssStyleElementFiltersSelectOptionTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "selectOption"
  });
}

// Style Typography Options
export function cssStyleElementFiltersOptionTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "options" });
}

export function cssStyleElementFiltersOptionTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "options" });
}

export function cssStyleElementFiltersOptionTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "options" });
}

export function cssStyleElementFiltersOptionTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "options" });
}

export function cssStyleElementFiltersOptionTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "options"
  });
}

// Style Typography Text
export function cssStyleElementFiltersCheckTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "check" });
}

export function cssStyleElementFiltersCheckTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "check" });
}

export function cssStyleElementFiltersCheckTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "check" });
}

export function cssStyleElementFiltersCheckTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "check" });
}

export function cssStyleElementFiltersCheckTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "check"
  });
}

// Style Typography Title
export function cssStyleElementFiltersTitleTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "title" });
}

export function cssStyleElementFiltersTitleTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "title" });
}

export function cssStyleElementFiltersTitleTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "title" });
}

export function cssStyleElementFiltersTitleTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "title" });
}

export function cssStyleElementFiltersTitleTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "title"
  });
}

// Style Typography Label
export function cssStyleElementFiltersLabelTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "label" });
}

export function cssStyleElementFiltersLabelTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "label" });
}

export function cssStyleElementFiltersLabelTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "label" });
}

export function cssStyleElementFiltersLabelTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "label" });
}

export function cssStyleElementFiltersLabelTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    prefix: "label"
  });
}

// Style Typography Btn
export function cssStyleElementFiltersBtnTypography2FontFamily({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontFamily({ v, device, prefix: "btn" });
}

export function cssStyleElementFiltersBtnTypography2FontSize({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontSize({ v, device, prefix: "btn" });
}

export function cssStyleElementFiltersBtnTypography2LineHeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2LineHeight({ v, device, prefix: "btn" });
}

export function cssStyleElementFiltersBtnTypography2FontWeight({
  v,
  device
}: CSSValue): MString {
  return cssStyleTypography2FontWeight({ v, device, prefix: "btn" });
}

export function cssStyleElementFiltersBtnTypography2LetterSpacing({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "btn" });
}

// Checkbox
export function cssStyleElementFiltersCheckboxTextColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "checkboxTextColor" });
}

export function cssStyleElementFiltersCheckboxBgColor({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  return type === "style-1" || type === "style-2" || type === "style-4"
    ? cssStyleBgColor({ v, device, state, prefix: "checkboxBg" })
    : "";
}

export function cssStyleElementFiltersCheckboxShadow({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });

  return type === "style-1" || type === "style-2" || type === "style-4"
    ? cssStyleBoxShadow({ v, device, state, prefix: "checkbox" })
    : "";
}

export function cssStyleElementFiltersCheckboxActiveBgColor({
  v,
  device
}: CSSValue): MString {
  return cssStyleBgColor({ v, device, state: "active", prefix: "checkboxBg" });
}

export function cssStyleElementFiltersCheckboxActiveTextColor({
  v,
  device
}: CSSValue): MString {
  return cssStyleColor({
    v,
    device,
    state: "active",
    prefix: "checkboxTextColor"
  });
}

export function cssStyleElementFiltersCheckboxActiveShadow({
  v,
  device
}: CSSValue): MString {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "checkbox" });
}

export function cssStyleElementFiltersCheckboxActiveBorder({
  v,
  device
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state: "active",
    prefix: "checkbox"
  });
}

export function cssStyleElementFiltersCheckboxOrientation({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });

  if (type === "style-1" || type === "style-2" || type === "style-4") {
    return orientation === "on" || orientation === "full"
      ? "display: block;"
      : "display: flex; flex-wrap: wrap;";
  }
}

export function cssStyleElementFiltersCheckboxOrientationCustomStyles({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  const orientation = styleElementFiltersCheckboxOrientationCustomStyles({
    v,
    device,
    state,
    prefix
  });
  if (type === "style-3") {
    return orientation === "on"
      ? "display: block;"
      : "display: flex; flex-wrap: wrap;";
  }
}

export function cssStyleElementFiltersCheckboxOrientationFull({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const counter = styleElementFiltersCheckboxShowCounter({
    v,
    device,
    state,
    prefix
  });
  return orientation === "full" && counter === "on"
    ? "width: 100% !important;"
    : "";
}

export function cssStyleElementFiltersCheckboxCounterFullPosition({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const counter = styleElementFiltersCheckboxShowCounter({
    v,
    device,
    state,
    prefix
  });
  return orientation === "full" && counter === "on"
    ? "flex-grow: 1; display: flex; justify-content: flex-end;"
    : "";
}

export function cssStyleElementFiltersCheckboxFullAlign({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const counter = styleElementFiltersCheckboxShowCounter({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });

  return orientation === "full" && counter === "on" && type !== "style-1"
    ? "justify-content: space-between;"
    : "";
}

export function cssStyleElementFiltersCheckboxColumns({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  const columns = styleElementFiltersCheckboxColumns({
    v,
    device,
    state,
    prefix
  });

  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });

  if (
    (filterType === "checkbox" ||
      filterType === "radio" ||
      filterType === "checkrange") &&
    (type === "style-1" || type === "style-2" || type === "style-4")
  ) {
    const width: number = columns ? 100 / Number.parseInt(columns) : 0;
    return orientation === "on" || orientation === "inline"
      ? ""
      : `flex-basis:${width}%;`;
  }
}

export function cssStyleElementFiltersCheckboxColumnsCustomStyles({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  const columns = styleElementFiltersCheckboxColumnsCustomStyles({
    v,
    device,
    state,
    prefix
  });

  const orientation = styleElementFiltersCheckboxOrientationCustomStyles({
    v,
    device,
    state,
    prefix
  });

  if (
    (filterType === "checkbox" ||
      filterType === "radio" ||
      filterType === "checkrange") &&
    type === "style-3"
  ) {
    return columns === undefined ||
      orientation === "on" ||
      orientation === "inline"
      ? ""
      : `flex-basis:${100 / Number.parseInt(columns)}%;`;
  }
}

export function cssStyleElementFiltersCheckboxBorder({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "checkbox"
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });

  return borderWidth !== undefined &&
    (type === "style-1" || type === "style-2" || type === "style-4")
    ? cssStyleBorder({ v, device, state, prefix: "checkbox" })
    : "";
}

// Options
export function cssStyleElementFiltersOptionsBgColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBgColor({ v, device, state, prefix: "optionsBg" });
}

export function cssStyleElementFiltersOptionsBorder({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "options"
  });
}

export function cssStyleElementFiltersOptionsBorderRadius({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorderRadius({ v, device, state, prefix: "options" });
}

export function cssStyleElementFiltersSelect2BorderRadius({
  v,
  device,
  state
}: CSSValue): MString {
  let topLeftRadius = 0;
  let topRightRadius = 0;
  let bottomLeftRadius = 0;
  let bottomRightRadius = 0;
  const radiusType = styleBorderRadiusType({
    v,
    device,
    state,
    prefix: "options"
  });

  if (radiusType === "grouped") {
    const radius = styleBorderRadiusGrouped({
      v,
      device,
      state,
      prefix: "options"
    });

    topLeftRadius = radius;
    topRightRadius = radius;
    bottomLeftRadius = radius;
    bottomRightRadius = radius;
  } else {
    topLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix: "options",
      current: "topLeft"
    });
    topRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix: "options",
      current: "topRight"
    });
    bottomLeftRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix: "options",
      current: "bottomLeft"
    });
    bottomRightRadius = styleBorderRadiusUngrouped({
      v,
      device,
      state,
      prefix: "options",
      current: "bottomRight"
    });
  }

  if (topLeftRadius === undefined) {
    return "";
  } else if (
    topLeftRadius === topRightRadius &&
    topLeftRadius === bottomLeftRadius &&
    topLeftRadius === bottomRightRadius &&
    topLeftRadius > 0
  ) {
    return `border-radius: ${topLeftRadius}px !important;`;
  } else if (
    topLeftRadius > 0 ||
    topRightRadius > 0 ||
    bottomLeftRadius > 0 ||
    bottomRightRadius > 0
  ) {
    return `border-radius:${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px !important;`;
  } else {
    return "border-radius:0 !important;";
  }
}

export function cssStyleElementFiltersCheckboxBorderRadius({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  return type === "style-1" || type === "style-2" || type === "style-4"
    ? cssStyleBorderRadius({ v, device, state, prefix: "checkbox" })
    : "";
}

export function cssStyleElementFiltersCheckboxBorderRadiusCustomStyles({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  return type === "style-3"
    ? cssStyleBorderRadius({ v, device, state, prefix: "checkboxCustomStyles" })
    : "";
}

export function cssStyleElementFiltersOptionsColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "optionsColor" });
}

// Title
export function cssStyleElementFiltersTitleColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementFiltersTitleSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersTitleSpacing({ v, device, state, prefix });
  return `margin-bottom: ${spacing}px;`;
}

// Tags
export function cssStyleElementFiltersActiveColumns({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const activeColumns = styleElementFiltersActiveColumns({
    v,
    device,
    state,
    prefix
  });

  const activeOrientation = styleElementFiltersActiveOrientation({
    v,
    device,
    state,
    prefix
  });

  if (filterType === "active") {
    return activeColumns === undefined ||
      activeOrientation === "on" ||
      activeOrientation === "inline"
      ? ""
      : `flex-basis:${100 / Number.parseInt(activeColumns)}%;`;
  }
}

export function cssStyleElementFiltersActiveOrientation({
  v,
  device,
  state
}: CSSValue): MString {
  const orientation = styleElementFiltersActiveOrientation({
    v,
    device,
    state
  });
  return orientation === "on"
    ? "display:block; width:100%;"
    : "display:flex; flex-wrap:wrap; width: 100%;";
}

export function cssStyleElementFiltersActiveWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const orientation = styleElementFiltersActiveOrientation({
    v,
    device,
    state
  });
  return orientation === "on" ? "width: fit-content;" : "";
}

export function cssStyleElementFiltersLabelColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "labelColor" });
}

export function cssStyleElementFiltersSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersSpacing({ v, device, state, prefix });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  if (filterType === "checkrange") {
    return `margin-left: ${spacing}px !important;`;
  } else if (type !== "style-2") {
    return `margin-left: ${spacing}px;`;
  } else {
    return "";
  }
}

export function cssStyleElementFiltersDateSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersSpacing({ v, device, state, prefix });
  return `margin-right: ${spacing}px;`;
}

export function cssStyleElementFiltersGapStyle1({
  v,
  device,
  state,
  prefix
}: CSSValue): MString | void {
  const gap = styleElementFiltersGap({ v, device, state, prefix });
  const align = styleElementFiltersOptionsAlign({ v, device, state, prefix });
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const orientationCustom = styleElementFiltersCheckboxOrientationCustomStyles({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  const orientationActive = styleElementFiltersActiveOrientation({
    v,
    device,
    state
  });
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  if (filterType === "active") {
    if (orientationActive === "inline") {
      switch (align) {
        case "left": {
          return `padding: 0 ${gap}px ${gap}px 0;`;
        }
        case "right": {
          return `padding: 0 0 ${gap}px ${gap}px;`;
        }
        case "center": {
          return `padding: 0 ${gap ? gap : 0 / 2}px ${gap}px ${
            gap ? gap : 0 / 2
          }px;`;
        }
      }
    } else {
      return `padding-bottom: ${gap}px;`;
    }
  }
  if (
    (orientation === "inline" || orientation === "off") &&
    (type === "style-1" || type === "style-2" || type === "style-4")
  ) {
    switch (align) {
      case "left": {
        return `padding: 0 ${gap}px ${gap}px 0;`;
      }
      case "right": {
        return `padding: 0 0 ${gap}px ${gap}px;`;
      }
      case "center": {
        return `padding: 0 ${gap ? gap : 0 / 2}px ${gap}px ${
          gap ? gap : 0 / 2
        }px;`;
      }
    }
  } else if (
    (orientationCustom === "inline" || orientationCustom === "off") &&
    type === "style-3"
  ) {
    switch (align) {
      case "left": {
        return gap ? `padding: 0 ${gap}px ${gap}px 0;` : "";
      }
      case "right": {
        return gap ? `padding: 0 0 ${gap}px ${gap}px;` : "";
      }
      case "center": {
        return gap
          ? `padding: 0 ${gap ? gap : 0 / 2}px ${gap}px ${gap ? gap : 0 / 2}px;`
          : "";
      }
    }
  } else {
    return gap ? `padding-bottom: ${gap}px;` : "";
  }
}

export function cssStyleElementFiltersGapStyle1Revert({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const gap = styleElementFiltersGap({ v, device, state, prefix });
  const align = styleElementFiltersOptionsAlign({ v, device, state, prefix });
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  if (orientation === "off") {
    switch (align) {
      case "left": {
        return gap ? `margin: 0 -${gap}px -${gap}px 0;` : "";
      }
      case "right": {
        return gap ? `margin: 0  0 -${gap}px -${gap}px;` : "";
      }
      case "center": {
        return gap
          ? `margin: 0 -${gap ? gap : 0 / 2}px -${gap}px -${
              gap ? gap : 0 / 2
            }px;`
          : "";
      }
    }
  }
  return `margin-bottom: -${gap}px;`;
}

export function cssStyleElementFiltersOptionWidth({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleSizeWidth({ v, device, state, prefix: "option" });
}

export function cssStyleElementFiltersLabelSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersLabelSpacing({ v, device, state, prefix });
  const type = styleElementFiltersType({ v, device, state, prefix });
  return type === "date"
    ? `margin-bottom: ${spacing}px;`
    : `margin-top: ${spacing}px;`;
}

export function cssStyleElementFiltersBtnWidth({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleSizeWidth({ v, device, state, prefix: "btn" });
}

export function cssStyleElementFiltersBtnHeight({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const height = styleElementFiltersBtnHeight({ v, device, state, prefix });
  return `padding: ${height}px 42px ${height}px 42px;`;
}

export function cssStyleFlexHorizontalAlignBtn({
  v,
  device,
  state
}: CSSValue): MString {
  const alignItems = styleElementFiltersHorizontalAlignBtn({
    v,
    device,
    state
  });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleElementFiltersBtnSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersBtnSpacing({ v, device, state, prefix });
  return `margin-top: ${spacing}px;`;
}

export function cssStyleFlexHorizontalAlignOption({
  v,
  device,
  state
}: CSSValue): MString {
  const alignItems = styleElementFiltersHorizontalAlignOption({
    v,
    device,
    state
  });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleFlexHorizontalAlignLabel({
  v,
  device,
  state
}: CSSValue): MString {
  const alignItems = styleElementFiltersHorizontalAlignLabel({
    v,
    device,
    state
  });

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleFlexHorizontalAlignForInline({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const alignItems = styleElementFiltersHorizontalAlignOption({
    v,
    device,
    state
  });
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });

  if (orientation !== "inline") {
    return "";
  }

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleFlexHorizontalAlignForActiveInline({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const alignItems = styleElementFiltersHorizontalAlignOption({
    v,
    device,
    state
  });
  const orientation = styleElementFiltersActiveOrientation({
    v,
    device,
    state,
    prefix
  });

  if (orientation !== "inline") {
    return "";
  }

  return alignItems === undefined ? "" : `justify-content:${alignItems};`;
}

export function cssStyleElementFiltersPaddingOptions({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "options"
  });
}

export function cssStyleElementFiltersPaddingSelectItems({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "selectItem"
  });
}

export function cssStyleElementFiltersPaddingCheckbox({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });

  return type === "style-1" || type === "style-2" || type === "style-4"
    ? cssStylePaddingFourFields({
        v,
        device,
        state,
        prefix: "checkbox"
      })
    : "";
}

export function cssStyleElementFiltersPaddingCheckboxCustomStyles({
  v,
  device,
  state
}: CSSValue): MString {
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });

  return type === "style-3"
    ? cssStylePaddingFourFields({
        v,
        device,
        state,
        prefix: "checkboxCustomStyles"
      })
    : "";
}

export function cssStyleElementFiltersRatingColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "ratingActiveColor" });
}

export function cssStyleElementFiltersRatingActiveColor({
  v,
  device
}: CSSValue): MString {
  return cssStyleColor({
    v,
    device,
    state: "active",
    prefix: "ratingActiveColor"
  });
}

export function cssStyleElementFiltersRatingHoverColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "hoverRatingActiveColor" });
}

export function cssStyleElementFiltersDateOptionWidth({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const width = styleElementFiltersDateOptionWidth({
    v,
    device,
    state,
    prefix
  });
  return width ? `width: ${Number.parseInt(width) / 2}%;` : "";
}

export function cssStyleElementFiltersRangeStrokeBorder({
  v,
  device,
  state
}: CSSValue): MString {
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });

  return borderColor === undefined ? "" : `background-color: ${borderColor};`;
}

export function cssStyleElementFiltersRangeStrokeBorderActive({
  v,
  device
}: CSSValue): MString {
  const borderColor = styleBorderColor({
    v,
    device,
    state: "active",
    prefix: "rangeStroke"
  });

  return borderColor === undefined ? "" : `background-color: ${borderColor};`;
}

export function cssStyleElementFiltersRangeStrokeBorderHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });

  return borderWidth === undefined ? "" : `height: ${borderWidth}px;`;
}

export function cssStyleElementFiltersRangeInputsHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });
  const border = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "range"
  });

  return borderWidth === undefined
    ? ""
    : `height: ${borderWidth + border * 2}px;`;
}

export function cssStyleElementFiltersRangeStrokeMargin({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });

  return borderWidth === undefined ? "" : `margin: 0 ${borderWidth / 2}px;`;
}

export function cssStyleElementFiltersRangePointsBorder({
  v,
  device,
  state
}: CSSValue): MString {
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    prefix: "rangePoints"
  });

  return borderColor === undefined ? "" : `background-color: ${borderColor};`;
}

export function cssStyleElementFiltersRangePointsBorderHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangePoints"
  });

  return borderWidth === undefined
    ? ""
    : `height: ${borderWidth}px; width: ${borderWidth}px;`;
}

export function cssStyleElementFiltersRangeInputsPointsHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangePoints"
  });
  const border = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "range"
  });

  return borderWidth === undefined
    ? ""
    : `height: ${borderWidth + border * 2}px; width: ${
        borderWidth + border * 2
      }px;`;
}

export function cssStyleElementFiltersRangePointsTransition({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidthPoints = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangePoints"
  });
  const borderWidthStroke = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });
  const border = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "range"
  });

  const vertical = borderWidthPoints / 2 - borderWidthStroke / 2 + border;

  return borderWidthPoints === undefined
    ? ""
    : `transform: translate(-${borderWidthPoints / 2}px, -${vertical}px)`;
}

export function cssStyleElementFiltersRangePointsTransitionRight({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidthPoints = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangePoints"
  });
  const borderWidthStroke = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangeStroke"
  });
  const border = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "range"
  });

  const vertical = borderWidthPoints / 2 - borderWidthStroke / 2 + border;

  return borderWidthPoints === undefined
    ? ""
    : `transform: translate(${borderWidthPoints / 2}px, -${vertical}px)`;
}

export function cssStyleElementFiltersRangeWrapperHeight({
  v,
  device,
  state
}: CSSValue): MString {
  const rangeHeight = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "rangePoints"
  });
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "range"
  });
  return `height: ${rangeHeight + borderWidth * 2}px;`;
}

export function cssStyleElementFiltersRangeBorder({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "range"
  });
}

export function cssStyleElementFiltersCheckRadioWidth({
  v,
  device,
  state
}: CSSValue): MString {
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  return orientation === "off" && (type === "style-1" || type === "style-2")
    ? "width: 100%!important; align-self: flex-start;"
    : "";
}

export function cssStyleElementFiltersOptionSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersOptionSpacing({
    v,
    device,
    state,
    prefix
  });
  return `margin-bottom: ${spacing}px;`;
}

export function cssStyleElementFiltersHierarchicalSpacing({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersHierarchicalSpacing({
    v,
    device,
    state,
    prefix
  });
  const align = styleElementFiltersOptionsAlign({ v, device, state, prefix });
  const dataSource = styleElementFiltersDataSource({
    v,
    device,
    state,
    prefix
  });
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  if (
    (filterType === "checkbox" ||
      filterType === "radio" ||
      filterType === "checkrange") &&
    orientation === "on" &&
    dataSource !== "manual" &&
    (type === "style-1" || type === "style-2")
  ) {
    return align === "left" || align === "center"
      ? `margin-left: ${spacing}px;`
      : `margin-right: ${spacing}px;`;
  } else {
    return "margin-left: 0; margin-right: 0;";
  }
}

export function cssStyleElementFiltersHierarchicalSpacing2X({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersHierarchicalSpacing({
    v,
    device,
    state,
    prefix
  });
  const align = styleElementFiltersOptionsAlign({ v, device, state, prefix });
  const dataSource = styleElementFiltersDataSource({
    v,
    device,
    state,
    prefix
  });
  const orientation = styleElementFiltersCheckboxOrientation({
    v,
    device,
    state,
    prefix
  });
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  if (
    (filterType === "checkbox" ||
      filterType === "radio" ||
      filterType === "checkrange") &&
    orientation === "on" &&
    dataSource !== "manual" &&
    (type === "style-1" || type === "style-2")
  ) {
    return align === "left" || align === "center"
      ? `margin-left: ${spacing ? spacing : 0 * 2}px;`
      : `margin-right: ${spacing ? spacing : 0 * 2}px;`;
  } else {
    return "margin-left: 0; margin-right: 0;";
  }
}

export function cssStyleElementFiltersOptionSpacingMinus({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const spacing = styleElementFiltersOptionSpacing({
    v,
    device,
    state,
    prefix
  });
  const apply = styleElementFiltersShowApply({ v, device, state, prefix });
  return apply === "off"
    ? `margin-bottom: -${spacing}px;`
    : "margin-bottom: 0;";
}

export function cssStyleElementFiltersCheckboxStyle3BgColor({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  return filterType == "checkrange"
    ? "background-color: transparent;"
    : cssStyleBgColor({ v, device, state, prefix: "checkStyle3Bg" });
}

export function cssStyleElementFiltersCheckIconColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "checkIconColor" });
}

export function cssStyleElementFiltersActiveCheckIconColor({
  v,
  device
}: CSSValue): MString {
  return cssStyleColor({
    v,
    device,
    state: "active",
    prefix: "checkIconColor"
  });
}

export function cssStyleElementFiltersCheckIconBorder({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "checkIcon"
  });
}

export function cssStyleElementFiltersActiveCheckIconBorder({
  v,
  device
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state: "active",
    prefix: "checkIcon"
  });
}

export function cssStyleElementFiltersCheckIconBorderRadius({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorderRadius({ v, device, state, prefix: "checkIcon" });
}

export function cssStyleElementFiltersCheckIconShadow({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBoxShadow({ v, device, state, prefix: "checkIcon" });
}

export function cssStyleElementFiltersActiveCheckIconShadow({
  v,
  device
}: CSSValue): MString {
  return cssStyleBoxShadow({ v, device, state: "active", prefix: "checkIcon" });
}

export function cssStyleElementFiltersCheckSize({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleSizeFontSize({ v, device, state, prefix: "check" });
}

export function cssStyleElementFiltersCheckColor3({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const size = styleElementFiltersCheckColorSize({ v, device, state, prefix });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state
  });
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  return (filterType === "checkbox" || filterType === "radio") &&
    type === "style-3"
    ? `width: ${size}px; height: ${size}px;`
    : "width: fit-content;";
}

export function cssStyleElementFiltersCheckStyle3Border({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "checkStyle3"
  });
}

export function cssStyleElementFiltersCheckStyle3Shadow({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBoxShadow({ v, device, state, prefix: "checkStyle3" });
}

export function cssStyleElementFiltersCheckImgWidth({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  return (filterType === "checkbox" || filterType === "radio") &&
    type === "style-4"
    ? cssStyleSizeWidth({ v, device, state, prefix: "img" })
    : "";
}

export function cssStyleElementFiltersCheckImgHeight({
  v,
  device,
  state,
  prefix
}: CSSValue): MString {
  const filterType = styleElementFiltersType({
    v,
    device,
    state,
    prefix
  });
  const type = styleElementFiltersCheckboxType({
    v,
    device,
    state,
    prefix
  });
  return (filterType === "checkbox" || filterType === "radio") &&
    type === "style-4"
    ? cssStyleSizeHeight({ v, device, state, prefix: "img" })
    : "";
}

export function cssStyleElementFiltersSelectOptionColor({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleColor({ v, device, state, prefix: "selectOptionColor" });
}

export function cssStyleElementFiltersSelectOptionBorder({
  v,
  device,
  state
}: CSSValue): MString {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "selectOption"
  });
  const borderStyle = styleBorderStyle({
    v,
    device,
    state,
    prefix: "selectOption"
  });
  const borderColor = styleBorderColor({
    v,
    device,
    state,
    prefix: "selectOption"
  });

  return borderWidth === undefined
    ? ""
    : `border-bottom:${borderWidth}px ${borderStyle} ${borderColor};`;
}

export function cssStyleElementFiltersSelectOptionBgColor({
  v,
  device,
  state
}: CSSValue): MString {
  const bgColor = styleBgColor({ v, device, state, prefix: "selectOptionBg" });

  const bgGradient = styleBgGradient({
    v,
    device,
    state
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor} !important;`;
}

export function cssStyleElementFiltersSelectOptionShadow({
  v,
  device,
  state
}: CSSValue): MString {
  return cssStyleBoxShadow({ v, device, state, prefix: "selectOption" });
}

export function cssStyleElementFiltersSelectOptionsColors(): MString {
  return "background-color: inherit !important; color: inherit !important;";
}

export function cssStyleElementFiltersDateOptionWidthFix(): MString {
  return "width: 100% !important;";
}

export function cssStyleElementFiltersSelectArrow({
  v,
  device,
  state
}: CSSValue): MString {
  const p = cssStylePadding({ v, device, state, prefix: "options" });

  return `right:${p.paddingTop}px !important;`;
}

import { defaultValueValue } from "visual/utils/onChange";
import {
  styleSizeWidth,
  styleSizeHeight,
  styleAlignHorizontal,
  styleBorderWidthUngrouped,
  styleBorderColor,
  styleBorderStyle,
  styleBgColorHex,
  styleBorderWidthGrouped,
  styleElementForm2FieldColumns,
  styleTypography2LineHeight,
  styleTypography2FontSize,
  styleBorderWidthType
} from "visual/utils/style2";
import {
  cssStyleColor,
  cssStyleBgColor,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStylePaddingFourFields,
  cssStylePadding
} from "visual/utils/cssStyle";
import { hexToRgba } from "visual/utils/color";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";

export function cssStyleElementForm2FlexBasisPercent({ v, device, state }) {
  const width = styleSizeWidth({ v, device, state });

  return width === undefined ? "" : `flex-basis:${width}%;`;
}

export function cssStyleElementForm2SubmitWidth({ v, device, state }) {
  const submitWidth = styleSizeWidth({ v, device, state, prefix: "submit" });

  return submitWidth === undefined
    ? ""
    : `max-width:${submitWidth}%;flex-basis:${submitWidth}%;`;
}

export function cssStyleElementForm2InputHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const type = dvv("type");
  const height = styleSizeHeight({ v, device, state });

  if (height === undefined || type === undefined) {
    return "";
  } else if (type === "Paragraph") {
    return `height:${height}px!important;`;
  } else {
    return "height:auto;";
  }
}

export function cssStyleElementForm2FieldsLabelAlign({ v, device, state }) {
  const align = styleAlignHorizontal({ v, device, state, prefix: "label" });

  return align === undefined ? "" : `text-align:${align};`;
}

export function cssStyleElementForm2Margin({ v, device, state }) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  } = cssStylePadding({ v, device, state });

  return paddingTop === undefined ||
    paddingRight === undefined ||
    paddingBottom === undefined ||
    paddingLeft === undefined
    ? ""
    : `margin:-${paddingTop}px -${paddingRight / 2}px
       -${paddingBottom}px -${paddingLeft / 2}px;`;
}

export function cssStyleElementForm2Padding({ v, device, state }) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingTopSuffix,
    paddingRightSuffix,
    paddingBottomSuffix,
    paddingLeftSuffix
  } = cssStylePadding({ v, device, state });

  return paddingTop === undefined ||
    paddingRight === undefined ||
    paddingBottom === undefined ||
    paddingLeft === undefined
    ? ""
    : `padding:${paddingTop}${paddingTopSuffix}
      ${paddingRight / 2}${paddingRightSuffix}
      ${paddingBottom}${paddingBottomSuffix}
      ${paddingLeft / 2}${paddingLeftSuffix};`;
}

export function cssStyleElementForm2FieldsLineHeight({ v, device, state }) {
  const modelLineHeight = styleTypography2LineHeight({ v, device });
  const fontSize = styleTypography2FontSize({ v, device });
  const { paddingTop, paddingBottom } = cssStylePadding({
    v,
    device,
    state
  });
  const borderWidth = getBorderTopBottomWidth({ v, device, state });
  const lineHeight = Math.round(fontSize * modelLineHeight * 10) / 10;

  return `min-height:${lineHeight +
    paddingTop +
    paddingBottom +
    borderWidth}px;`;
}

// label Font
export function cssStyleElementForm2FieldsLabelFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelLineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelFontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelLetterSpacing({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelPadding({ v, device, state }) {
  return cssStylePaddingFourFields({ v, device, state, prefix: "label" });
}

export function cssStyleElementForm2FieldsCheckboxColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "checkboxColor" });
}

export function cssStyleElementForm2FieldsCheckboxFontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsCheckboxFontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsCheckboxFontWeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsCheckboxLetterSpacing({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsCheckboxLineHeight({ v, device }) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsSelectColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "selectColor" });
}

export function cssStyleElementForm2FieldsSelectBgColor({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "selectBg" });
}

export function cssStyleElementForm2FieldsBorderRequired({ v, device, state }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, state });

  return borderWidth === undefined || borderWidth === 0
    ? "border: 2px solid #f00"
    : "border-color: #f00";
}

export function cssStyleElementForm2FieldsSelectChoiceBgColor({
  v,
  device,
  state
}) {
  const bgColorHex = styleBgColorHex({ v, device, state, prefix: "selectBg" });

  return bgColorHex === undefined
    ? ""
    : `background-color:${hexToRgba(bgColorHex, 0.2)};`;
}

export function cssStyleElementForm2FieldsSelectBorder({ v, device, state }) {
  const borderWidth = styleBorderWidthUngrouped({
    v,
    device,
    state,
    prefix: "select",
    current: "top"
  });
  const borderStyle = styleBorderStyle({ v, device, state, prefix: "select" });
  const borderColor = styleBorderColor({ v, device, state, prefix: "select" });

  return borderWidth === undefined
    ? ""
    : `border-bottom:${borderWidth}px ${borderStyle} ${borderColor};`;
}

export function cssStyleElementForm2FieldsSelectBorderRadius({
  v,
  device,
  state
}) {
  return cssStyleBorderRadius({ v, device, state, prefix: "select" });
}

export function cssStyleElementForm2FieldsSelectBoxShadow({
  v,
  device,
  state
}) {
  return cssStyleBoxShadow({ v, device, state, prefix: "select" });
}

export function cssStyleElementForm2FieldColumns({ v, device, state }) {
  const columns = styleElementForm2FieldColumns({ v, device, state });

  return columns === undefined ? "" : `flex-basis:${100 / columns}%;`;
}

function getBorderTopBottomWidth({ v, device, state, prefix = "" }) {
  let borderTopWidth = 0;
  let borderBottomWidth = 0;
  let borderWidthType = styleBorderWidthType({ v, device, state, prefix });

  if (borderWidthType === "grouped") {
    const borderWidth = styleBorderWidthGrouped({ v, device, state, prefix });

    borderTopWidth = borderWidth;
    borderBottomWidth = borderWidth;
  } else {
    borderTopWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "top"
    });
    borderBottomWidth = styleBorderWidthUngrouped({
      v,
      device,
      state,
      prefix,
      current: "bottom"
    });
  }

  return borderTopWidth + borderBottomWidth;
}

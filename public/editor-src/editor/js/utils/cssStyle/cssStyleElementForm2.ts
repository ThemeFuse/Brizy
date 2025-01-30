import { ElementModel } from "visual/component/Elements/Types";
import type { StylesProps as Props } from "visual/editorComponents/Form2/Form2Steps/types";
import { WithRenderContext } from "visual/providers/RenderProvider";
import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import {
  cssStyleBgColor,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBoxShadow,
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStylePadding,
  cssStylePaddingFourFields,
  cssStyleTextAlign,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import * as Str from "visual/utils/reader/string";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";
import {
  styleBorderWidthGrouped,
  styleBorderWidthType,
  styleBorderWidthUngrouped,
  styleElementForm2FieldColumns,
  styleSizeHeight,
  styleSizeWidth,
  styleTypography2FontSize,
  styleTypography2LineHeight
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { IconSizeType, readIconSize } from "visual/utils/types/Type";
import { MValue } from "visual/utils/value";

const getIconSize = (
  iconSize: IconSizeType,
  iconCustomSize: number
): MValue<number> => {
  switch (readIconSize(iconSize)) {
    case "small": {
      return 16;
    }
    case "medium": {
      return 24;
    }
    case "large": {
      return 32;
    }
    case "custom": {
      return iconCustomSize;
    }
  }
};

export function cssStyleElementForm2FlexBasisPercent({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state, store });

  return width === undefined ? "" : `flex-basis:${width}%;`;
}

export function cssStyleElementForm2SubmitWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const submitWidth = styleSizeWidth({
    v,
    device,
    state,
    store,
    prefix: "submit"
  });

  return submitWidth === undefined
    ? ""
    : `max-width:${submitWidth}%;flex-basis:${submitWidth}%;`;
}

export function cssStyleElementForm2InputHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const type = dvv("type");
  const height = styleSizeHeight({ v, device, state, store });

  if (height === undefined || type === undefined) {
    return "";
  } else if (type === "Paragraph") {
    return `height:${height}px!important;`;
  } else {
    return "height:auto;";
  }
}

export function cssStyleElementForm2FieldsLabelAlign({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextAlign({ v, device, state, store, prefix: "label" });
}

export function cssStyleElementForm2Margin({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const padding = dvv("padding");

  return padding === undefined || isStory(config)
    ? ""
    : `margin: 0 -${padding / 2}px -${padding}px -${padding / 2}px;`;
}

export function cssStyleElementForm2Padding({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const padding = dvv("padding");
  const suffix = dvv("paddingSuffix");

  return padding === undefined
    ? ""
    : isStory(config)
      ? `padding:0 0 ${padding}${suffix} 0;`
      : `padding: 0 ${padding / 2}${suffix} ${padding}${suffix} ${
          padding / 2
        }${suffix};`;
}

export function cssStyleElementForm2FieldsLineHeight(d: CSSValue): string {
  const modelLineHeight =
    Num.read(
      styleTypography2LineHeight({
        ...d,
        state: NORMAL
      })
    ) ?? 0;

  const fontSize = styleTypography2FontSize({ ...d, state: NORMAL });
  const { paddingTop, paddingBottom } = cssStylePadding(d);
  const borderWidth = getBorderTopBottomWidth(d);
  const lineHeight = Math.round(fontSize * modelLineHeight * 10) / 10;

  return `min-height:${
    lineHeight + paddingTop + paddingBottom + borderWidth
  }px;`;
}

// label Font
export function cssStyleElementForm2FieldsLabelFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "label",
    renderContext
  });
}

export function cssStyleElementForm2FieldsLabelFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "label" });
}

export function cssStyleElementForm2FieldsLabelLetterSpacing({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state: NORMAL,
    store,
    prefix: "label"
  });
}

export function cssStyleElementForm2FieldsLabelFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "label"
  });
}

export function cssStyleElementForm2FieldsLabelPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "label" });
}

export function cssStyleElementForm2FieldsCheckboxColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "checkboxColor" });
}

export function cssStyleElementForm2FieldsCheckboxFontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "checkbox",
    renderContext
  });
}

export function cssStyleElementForm2FieldsCheckboxFontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "checkbox" });
}

export function cssStyleElementForm2FieldsCheckboxFontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementForm2FieldsCheckboxLetterSpacing({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementForm2FieldsCheckboxLineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state: NORMAL,
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementForm2FieldsCheckboxFontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementForm2FieldsSelectColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "selectColor" });
}

export function cssStyleElementForm2FieldsSelectBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "selectBg" });
}

export function cssStyleElementForm2FieldsBorderRequired({
  v,
  device,
  state
}: CSSValue): string {
  const borderWidth = styleBorderWidthGrouped({ v, device, state });

  return borderWidth === undefined || borderWidth === 0
    ? "border: 2px solid #f00"
    : "border-color: #f00";
}

export function cssStyleElementForm2FieldsSelectChoiceBgColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "selectBg" });
}

export function cssStyleElementForm2FieldsSelectBorder({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementForm2FieldsSelectBorderRadius({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBorderRadius({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementForm2FieldsSelectBoxShadow({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state, store, prefix: "select" });
}

export function cssStyleElementForm2FieldColumns({
  v,
  device,
  state
}: CSSValue): string {
  const columns = styleElementForm2FieldColumns({ v, device, state });

  return columns === undefined ? "" : `flex-basis:${100 / columns}%;`;
}

function getBorderTopBottomWidth(d: CSSValue): number {
  let borderTopWidth = 0;
  let borderBottomWidth = 0;
  const borderWidthType = styleBorderWidthType(d);

  if (borderWidthType === "grouped") {
    const borderWidth = styleBorderWidthGrouped(d);

    borderTopWidth = borderWidth;
    borderBottomWidth = borderWidth;
  } else {
    borderTopWidth = styleBorderWidthUngrouped({
      ...d,
      current: "top"
    });
    borderBottomWidth = styleBorderWidthUngrouped({
      ...d,
      current: "bottom"
    });
  }

  return Num.read(borderTopWidth + borderBottomWidth) ?? 0;
}

export function cssStyleElementForm2FieldsLabelTextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "label" });
}

export function cssStyleElementForm2FieldsCheckboxTextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    prefix: "checkbox"
  });
}

export function cssStyleElementForm2StoryButtonHeight({ v }: CSSValue): string {
  return `content: ""; padding-top: ${v.submitHeight}%;`;
}

export function cssStyleElementForm2MSIndicatorsAlign({
  props
}: CSSValue<ElementModel, Props>): string {
  const { viewType } = props ?? {};

  if (viewType === "number-text" || viewType === "icon-text") {
    return "align-items:stretch;";
  }

  return "align-items:center;";
}

export function cssStyleElementForm2MSNumberColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "numberColor" });
}

export function cssStyleElementForm2MSActiveNumberColor({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "numberColor"
  });
}

export function cssStyleElementForm2MSTextColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "textColor" });
}

export function cssStyleElementForm2MSActiveTextColor({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "textColor"
  });
}

export function cssStyleElementForm2MSNumberPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "step" });
}

export function cssStyleElementFomr2MSDividerMargin({
  v,
  device,
  state,
  props
}: CSSValue<ElementModel, Props>): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { viewType } = props ?? {};
  const stepPadding = Num.read(dvv("stepPadding"));
  const borderWidth = Num.read(dvv("borderWidth"));
  const dividerWidth = Num.read(dvv("dividerWidth"));
  const iconSize = getIconSize(dvv("iconSize"), dvv("iconCustomSize"));

  if (viewType === "number-text" || viewType === "icon-text") {
    const indicatorHeight =
      viewType === "number-text"
        ? (Num.read(dvv("fontSize")) ?? 16) *
          (Num.read(dvv("lineHeight")) ?? 1.5)
        : iconSize;

    const height = Num.read(indicatorHeight);

    if (stepPadding && borderWidth && dividerWidth && height) {
      const totalHeight = stepPadding * 2 + borderWidth * 2 + height;

      return `margin-top:${totalHeight / 2 - dividerWidth / 2}px;`;
    }
  }

  return "margin-top:0;";
}

export function cssStyleElementFomr2MSDivider({
  v,
  device,
  store
}: CSSValue): string {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const config = configSelector(store.getState());

  const dividerWidth = dvv("dividerWidth");

  const color = getColor(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity"),
    config
  );

  if (Num.read(dividerWidth) && Str.read(color)) {
    return `border-top:${dividerWidth}px solid ${color};`;
  }

  return "";
}

export function cssStyleElementForm2MSProgressBgColor({
  v,
  device,
  state,
  store,
  props
}: CSSValue<ElementModel, Props>): string {
  const { viewType } = props ?? {};

  if (viewType !== "progressBar") return "";

  return cssStyleBgColor({ v, device, state, store, prefix: "progressBg" });
}

export function cssStyleElementForm2MSProgressBoxShadow({
  v,
  device,
  state,
  store,
  props
}: CSSValue<ElementModel, Props>): string {
  const { viewType } = props ?? {};

  if (viewType !== "progressBar") return "";

  return cssStyleBoxShadow({ v, device, store, state });
}

export function cssStyleElementForm2MSProgressColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, store, prefix: "progress" });
}

export function cssStyleElementForm2MSProgressHeight({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const progressHeight = Num.read(dvv("progressHeight"));

  return progressHeight ? `height:${progressHeight}px;` : "";
}

export function cssStyleElementForm2MSIndicatorsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const indicatorsSpacing = Num.read(dvv("indicatorsSpacing"));

  return indicatorsSpacing ? `margin-bottom:${indicatorsSpacing}px;` : "";
}

export function cssStyleElementForm2MSProgressMargin({
  v,
  device,
  state,
  store
}: CSSValue): string {
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

  if (
    paddingTop === undefined ||
    paddingRight === undefined ||
    paddingBottom === undefined ||
    paddingLeft === undefined
  ) {
    return "";
  }

  const config = configSelector(store.getState());
  if (isStory(config)) {
    return `margin:0 0 ${paddingBottom}${paddingBottomSuffix} 0;`;
  }

  return `margin:${paddingTop}${paddingTopSuffix}
      ${paddingRight / 2}${paddingRightSuffix}
      ${paddingBottom}${paddingBottomSuffix}
      ${paddingLeft / 2}${paddingLeftSuffix};`;
}

export function cssStyleElementForm2MSActiveBorder({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBorder({ v, device, store, state: ACTIVE });
}

export function cssStyleElementForm2MSActiveBg({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state: ACTIVE, store });
}

export function cssStyleElementForm2MSDividerIndent({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dividerIndent = Num.read(dvv("dividerIndent"));

  return dividerIndent !== undefined ? `padding:0 ${dividerIndent}px;` : "";
}

export function cssStyleElementForm2MSActiveBoxShadow({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleBoxShadow({ v, device, state: ACTIVE, store });
}

export function cssStyleElementsForm2MSTextSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const textSpacing = Num.read(dvv("textSpacing"));

  return textSpacing ? `margin-top:${textSpacing}px;` : "";
}

export function cssStyleElementForm2MSCustomIconColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
    prefix: "numberColor"
  });
}

export function cssStyleElementForm2MSActiveCustomIconColor({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleCustomIconColor({
    v,
    device,
    state: ACTIVE,
    store,
    prefix: "numberColor"
  });
}

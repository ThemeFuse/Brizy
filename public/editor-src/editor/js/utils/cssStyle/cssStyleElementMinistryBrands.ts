import {
  cssStyleBgColor,
  cssStyleBgGradient,
  cssStyleBorder,
  cssStyleBorderRadius,
  cssStyleBorderRadiusType,
  cssStyleColor,
  cssStyleDisplayFlex,
  cssStyleElementButtonSize,
  cssStyleFilter,
  cssStyleFlexColumnHorizontalAlign,
  cssStyleFlexHorizontalAlign,
  cssStyleHoverTransition,
  cssStyleMargin,
  cssStylePaddingFourFields,
  cssStyleSizeMaxWidth,
  cssStyleTextAlign,
  getAllCssStyleTypography,
  getFillType
} from "visual/utils/cssStyle";
import { read as readNumber } from "visual/utils/reader/number";
import { read as readString } from "visual/utils/reader/string";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";
import { ACTIVE } from "../stateMode";
import { capByPrefix } from "../string";
import { styleSizeHeight, styleSizeWidth } from "../style2";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleDropShadow } from "./cssStyleDropShadow";

// Title
export function cssStyleElementOfMinistryBrandsTitleTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "titleTypography"
  });
}

// Date
export function cssStyleElementOfMinistryBrandsDateTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "dateTypography"
  });
}

export function cssStyleElementOfMinistryBrandsDateColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "dateColor" });
}

export function cssStyleElementOfMinistryBrandsTitleColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "titleColor" });
}

export function cssStyleElementOfMinistryBrandsMetaColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "metaColor" });
}

// Links
export function cssStyleElementOfMinistryBrandsMetaLinksTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "metaLinksTypography"
  });
}

export function cssStyleElementOfMinistryBrandsMetaLinksColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "metaLinksColor" });
}

export function cssStyleElementOfMinistryBrandsMetaLinksBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "metaLinksBg" });
}

export function cssStyleElementOfMinistryBrandsMetaLinksBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "metaLinks" });
}

export const cssStyleElementOfMinistryBrandsMetaLinksBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "metaLinks"
  });
};

export const cssStyleElementOfMinistryBrandsMetaLinksBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "metaLinks"
  });
};

// Media
export function cssStyleElementOfMinistryBrandsMediaTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "mediaLinksTypography"
  });
}

// Preview
export function cssStyleElementOfMinistryBrandsPreviewTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "previewTypography"
  });
}

export function cssStyleElementOfMinistryBrandsPreviewColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "previewColor" });
}

// Pagination
export function cssStyleElementOfMinistryBrandsPaginationTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "paginationTypography"
  });
}

export function cssStyleElementOfMinistryBrandsPaginationColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "paginationColor" });
}

export function cssStyleElementOfMinistryBrandsPaginationColorActive({
  v,
  device
}: CSSValue): string {
  return cssStyleColor({ v, device, state: ACTIVE, prefix: "paginationColor" });
}

export function cssStyleMinistryElementFiltersBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "filterBg"
  });
}

//
export function cssStyleMinistryElementFiltersInputBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "inputBg"
  });
}

export function cssStyleMinistryElementFiltersInputColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "input"
  });
}

export function cssStyleMinistryElementFiltersTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "filterTypography"
  });
}

export function cssStyleElementOfMinistryBrandsColumnsNumber({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const columnNumber = readNumber(dvv("columnNumber")) ?? 3;
  const columnSize = 100 / columnNumber;
  const _columnSize =
    columnNumber === 1 ? columnSize : `calc(${columnSize}% - 15px)`;

  const delta = columnNumber === 1 ? 0 : 15 / (columnNumber - 1);
  const gap = delta ? delta * columnNumber : 0;

  return `--columnCount: ${columnNumber};--columnSize: ${_columnSize}; column-gap:${gap}px; row-gap:15px;`;
}

export function cssStyleElementOfMinistryBrandsColumnsNumberWithSpacing({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const itemSpacing = readNumber(dvv("itemSpacing")) ?? 15;
  const columnNumber = readNumber(dvv("columnNumber")) ?? 3;
  const columnSize = 100 / columnNumber;
  const _columnSize =
    columnNumber === 1
      ? `${columnSize}%`
      : `calc(${columnSize}% - ${itemSpacing}px)`;

  const delta = columnNumber === 1 ? 0 : itemSpacing / (columnNumber - 1);
  const gap = delta ? delta * columnNumber : 0;

  return `--columnCount: ${columnNumber};--columnSize: ${_columnSize}; column-gap:${gap}px; row-gap:${itemSpacing}px;`;
}

export function cssStyleElementOfMinistryBrandsHorizontalAlign({
  v,
  device,
  state
}: CSSValue): string {
  const textAlign = cssStyleTextAlign({ v, device, state, prefix: "item" });
  const alignItems = cssStyleFlexColumnHorizontalAlign({
    v,
    device,
    state,
    prefix: "item"
  });
  const flex = cssStyleDisplayFlex();

  return `${flex}${alignItems}${textAlign} flex-direction:column;`;
}

export function cssStyleElementOfMinistryBrandsButtonsHorizontalAlign({
  v,
  device,
  state
}: CSSValue): string {
  const alignItems = cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "item"
  });
  const flex = cssStyleDisplayFlex();

  return `${flex}${alignItems}`;
}

export function cssStyleElementOfMinistryBrandsContainerHorizontalAlign({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    prefix: "container"
  });
}

export function cssStyleElementOfMinistryBrandsSpacing({
  v,
  device,
  state,
  prefix = "item"
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const spacing = readNumber(dvv(capByPrefix(prefix, "spacing"))) ?? 10;
  const spacingSuffix =
    readString(dvv(capByPrefix(prefix, "spacingSuffix"))) ?? "px";

  return `gap: ${spacing}${spacingSuffix}`;
}

export function cssStyleElementOfMinistryBrandsMetaItemsSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleElementOfMinistryBrandsSpacing({
    v,
    device,
    state,
    prefix: "metaItem"
  });
}

export const cssStylementOfMinistryBrandsParentBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({ v, device, state, prefix: "parentBg" });
};

export const cssStylementOfMinistryBrandsParentBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({ v, device, state, prefix: "parent" });
};

export const cssStylementOfMinistryBrandsParentBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({ v, device, state, prefix: "parent" });
};

export const cssStylementOfMinistryBrandsParentBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({ v, device, state, prefix: "parent" });
};

export function cssStyleMinistryElementFiltersBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export function cssStyleMinistryElementFiltersBorder({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "input"
  });
}

export function cssStyleMinistryElementFiltersInputGradientColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "input"
  });
}

export function cssStyleMinistryElementFiltersBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    prefix: "filter"
  });
}

export const cssStyleMinistryElementMediaBorderRadius = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorderRadius({
    v,
    device,
    state,
    prefix: "media"
  });
};

export const cssStyleElementMinistryBrandsButtonsTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "detailButtonTypography"
  });
};

export const cssStyleElementMinistryBrandsButtonsBgColor = ({
  v,
  device,
  state,
  prefix = "detailButton"
}: CSSValue): string => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const fillType = getFillType(dvv(capByPrefix(prefix, "fillType")));

  switch (fillType) {
    case "filled":
      return cssStyleBgColor({
        v,
        device,
        state,
        prefix: capByPrefix(prefix, "bg")
      });
    case "outline":
      return "background-color: transparent!important;";
    case "default": {
      return "border: 0!important; background-color: transparent!important; box-shadow: none!important;";
    }
    case undefined:
      return "";
  }
};

export const cssStyleElementMinistryBrandsButtonsBgGradient = ({
  v,
  device,
  state,
  prefix = "detailButton"
}: CSSValue): string => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const fillType = getFillType(dvv(capByPrefix(prefix, "fillType")));

  switch (fillType) {
    case "filled":
      return cssStyleBgGradient({ v, device, state, prefix });
    case "outline":
    case "default":
      return "background: transparent;";
    case undefined:
      return "";
  }
};

export const cssStyleElementMinistryBrandsButtonsColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "detailButtonColor"
  });
};

export const cssStyleElementMinistryBrandsButtonsBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "detailButton"
  });
};

export const cssStyleElementMinistryBrandsButtonsBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "detailButton"
  });
};

// Register Button
export const cssStyleElementMinistryBrandsRegisterButtonTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "registerButtonTypography"
  });
};

export const cssStyleElementMinistryBrandsRegisterButtonBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleElementMinistryBrandsButtonsBgColor({
    v,
    device,
    state,
    prefix: "registerButton"
  });
};

export const cssStyleElementMinistryBrandsRegisterButtonBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleElementMinistryBrandsButtonsBgGradient({
    v,
    device,
    state,
    prefix: "registerButton"
  });
};

export const cssStyleElementMinistryBrandsRegisterButtonColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "registerButtonColor"
  });
};

export const cssStyleElementMinistryBrandsRegisterButtonBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "registerButton"
  });
};

export const cssStyleElementMinistryBrandsRegisterButtonBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "registerButton"
  });
};

export function cssStyleElementMinistryBrandsRegisterButtonSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleElementButtonSize({
    v,
    device,
    state,
    prefix: "registerButton"
  });
}

export function cssStyleElementOfMinistryBrandsParagraphTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "paragraphTypography"
  });
}

export function cssStyleElementOfMinistryBrandsParagraphColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "paragraphColor" });
}

export function cssStyleElementOfMinistryBrandsH4Typography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "h4Typography"
  });
}

export function cssStyleElementOfMinistryBrandsH4Color({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "h4Color" });
}

export function cssStyleElementOfMinistryBrandsListTypography({
  v,
  device,
  state
}: CSSValue): string {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "listTypography"
  });
}

export function cssStyleElementOfMinistryBrandsListColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "listColor" });
}

export function cssStyleElementOfMinistryBrandsListTypes({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const type = dvv("listType");

  switch (type) {
    case "ordered":
      return "list-style-type: decimal;";
    case "bullet":
      return "list-style-type: disc;";
    case "default":
      return "list-style-type: none;";
  }

  return "";
}

export function cssStyleElementOfMinistryBrandsListPaddingLeft({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const padding = dvv("listPadding");
  const suffix = dvv("listPaddingSuffix");

  return `padding-left: ${padding}${suffix};`;
}

export function cssStyleElementOfMinistryBrandsImageWidth({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleSizeMaxWidth({
    v,
    device,
    state,
    prefix: "img"
  });
}

export function cssStyleElementOfMinistryBrandsImagePadding({
  v,
  device,
  state
}: CSSValue): string {
  const height = styleSizeHeight({ v, device, state, prefix: "img" }) ?? 100;
  const width = styleSizeWidth({ v, device, state, prefix: "img" }) ?? 100;

  /*
    56.25 - aspect ratio of 16:9
    The calculation using this value, along with the image's width and height,
    maintains the image's proportions when resizing.
  */
  const _padding = 56.25 * height * 0.01 * width * 0.01;
  const padding = readNumber(_padding.toFixed(2));

  return `padding-bottom: ${padding}%;`;
}

export function cssStyleElementOfMinistryBrandsImgBgGradient({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgGradient({ v, device, state, prefix: "img" });
}

export function cssStyleElementOfMinistryBrandsImgBgColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "imgBg" });
}

export const cssStyleElementOfMinistryBrandsImgBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "img"
  });
};

export const cssStyleElementOfMinistryBrandsImgBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "img"
  });
};

export const cssStyleElementOfMinistryBrandsImgMaskShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleDropShadow({
    v,
    device,
    state,
    prefix: "imgMaskShadow"
  });
};
export const cssStyleElementOfMinistryBrandsImgFilters = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleFilter({
    v,
    device,
    state,
    prefix: "img"
  });
};

export function cssStyleElementOfMinistryBrandsMetaIconsSpacing({
  v,
  device,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const metaIconsSpacing = dvv(capByPrefix(prefix, "metaIconsSpacing")) ?? "10";
  const metaIconsSpacingSuffix =
    dvv(capByPrefix(prefix, "metaIconsSpacingSuffix")) ?? "px";

  return `margin-right: ${metaIconsSpacing}${metaIconsSpacingSuffix};`;
}

export function cssStyleElementOfMinistryBrandsFeaturedPreviewPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "img" });
}

export function cssStyleElementMinistryBrandsMetaItemTitleMargin({
  v,
  device,
  state,
  prefix = "metaTitle"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemTitlePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaTitle" });
}

export function cssStyleElementMinistryBrandsMetaItemDateMargin({
  v,
  device,
  state,
  prefix = "metaDate"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemDatePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaDate" });
}

export function cssStyleElementMinistryBrandsMetaItemCategoryMargin({
  v,
  device,
  state,
  prefix = "metaCategory"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemCategoryPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaCategory"
  });
}

export function cssStyleElementMinistryBrandsMetaItemGroupMargin({
  v,
  device,
  state,
  prefix = "metaGroup"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemGroupPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaGroup" });
}

export function cssStyleElementMinistryBrandsMetaItemSeriesMargin({
  v,
  device,
  state,
  prefix = "metaSeries"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemSeriesPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaSeries" });
}

export function cssStyleElementMinistryBrandsMetaItemPreacherMargin({
  v,
  device,
  state,
  prefix = "metaPreacher"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemPreacherPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaPreacher"
  });
}

export function cssStyleElementMinistryBrandsMetaItemPassageMargin({
  v,
  device,
  state,
  prefix = "metaPassage"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemPassagePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaPassage" });
}

export function cssStyleElementMinistryBrandsMetaItemDayMargin({
  v,
  device,
  state,
  prefix = "metaDay"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemDayPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaDay" });
}

export function cssStyleElementMinistryBrandsMetaItemTimesMargin({
  v,
  device,
  state,
  prefix = "metaTimes"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemTimesPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "metaTimes" });
}

export function cssStyleElementMinistryBrandsMetaItemStatusMargin({
  v,
  device,
  state,
  prefix = "metaStatus"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemStatusPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaStatus"
  });
}

export function cssStyleElementMinistryBrandsMetaItemChildcareMargin({
  v,
  device,
  state,
  prefix = "metaChildcare"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemChildcarePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaChildcare"
  });
}

export function cssStyleElementMinistryBrandsMetaItemResourceLinkMargin({
  v,
  device,
  state,
  prefix = "metaResourceLink"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemResourceLinkPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaResourceLink"
  });
}

export function cssStyleElementMinistryBrandsMetaItemLocationMargin({
  v,
  device,
  state,
  prefix = "metaLocation"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemLocationPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaLocation"
  });
}

export function cssStyleElementMinistryBrandsMetaItemAddressMargin({
  v,
  device,
  state,
  prefix = "metaAddress"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemAddressPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaAddress"
  });
}

export function cssStyleElementMinistryBrandsMetaItemRoomMargin({
  v,
  device,
  state,
  prefix = "metaRoom"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemRoomPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaRoom"
  });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorMargin({
  v,
  device,
  state,
  prefix = "metaCoordinator"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaCoordinator"
  });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorEmailMargin({
  v,
  device,
  state,
  prefix = "metaCoordinatorEmail"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorEmailPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaCoordinatorEmail"
  });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorPhoneMargin({
  v,
  device,
  state,
  prefix = "metaCoordinatorPhone"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemCoordinatorPhonePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaCoordinatorPhone"
  });
}

export function cssStyleElementMinistryBrandsMetaItemCostMargin({
  v,
  device,
  state,
  prefix = "metaCost"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemCostPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaCost"
  });
}

export function cssStyleElementMinistryBrandsMetaItemWebsiteMargin({
  v,
  device,
  state,
  prefix = "metaWebsite"
}: CSSValue): string {
  return cssStyleMargin({ v, device, state, prefix });
}

export function cssStyleElementMinistryBrandsMetaItemWebsitePadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({
    v,
    device,
    state,
    prefix: "metaWebsite"
  });
}

export function cssStyleElementOfMinistryBrandsSocialColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "socialColor" });
}

export const cssStyleElementOfMinistryBrandsSocialBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({ v, device, state, prefix: "socialBg" });
};

export const cssStyleElementOfMinistryBrandsSocialBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "social"
  });
};

export const cssStyleElementOfMinistryBrandsSocialBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "social"
  });
};

export const cssStyleElementOfMinistryBrandsSocialBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "social"
  });
};

export const cssStyleElementMinistryResultsHeadingTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "resultsHeadingTypography"
  });
};

export const cssStyleElementMinistryNoResultsParagraphTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "noResultsTypography"
  });
};

export const cssStyleElementMinistryResultsHeadingColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "resultsHeadingColor"
  });
};

export const cssStyleElementMinistryNoResultsParagraphColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "noResultsColor"
  });
};

export function cssStyleElementMinistryBrandsButtonsBorderRadius({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBorderRadiusType({
    v,
    device,
    state,
    prefix: "buttons"
  });
}

export function cssStyleElementMinistryBrandsButtonsSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleElementButtonSize({
    v,
    device,
    state,
    prefix: "detailButton"
  });
}

export function cssStyleMinistryBrandsButtonsHoverTransition({
  v,
  device,
  state
}: CSSValue) {
  return cssStyleHoverTransition({
    v,
    device,
    state,
    prefix: "buttons"
  });
}

export const cssStyleElementOfMinistryBrandsItemBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({ v, device, state, prefix: "item" });
};

export function cssStyleElementOfMinistryBrandsItemColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleBgColor({ v, device, state, prefix: "itemBg" });
}

export function cssStyleElementOfMinistryBrandsItemPadding({
  v,
  device,
  state
}: CSSValue): string {
  return cssStylePaddingFourFields({ v, device, state, prefix: "item" });
}

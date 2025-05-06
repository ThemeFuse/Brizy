import { ElementModel } from "visual/component/Elements/Types";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { StylesContexts } from "visual/types";
import {
  jestGetConfig,
  mockDataForReduxStore
} from "../../../../../jest-utils/mocks";
import { renderStyles } from "../cssStyle";

const store = {
  getState: () => mockDataForReduxStore
} as unknown as Store;

const contexts: StylesContexts = {
  renderContext: "editor",
  mode: Mode.page,
  getConfig: jestGetConfig
};

const defaultValue = {
  title: "Title",
  titlePopulation: "",
  titlePopulationEntityType: "",
  titlePopulationEntityId: "",

  description: "Description",
  descriptionPopulation: "",
  descriptionPopulationEntityType: "",
  descriptionPopulationEntityId: "",

  closeButtonState: "on",
  descriptionState: "on",

  numberFontFamily: "lato",
  tabletNumberFontFamily: null,
  mobileNumberFontFamily: null,
  titleFontFamily: "lato",
  tabletTitleFontFamily: null,
  mobileTitleFontFamily: null,
  tabletDescriptionFontFamily: null,
  mobileDescriptionFontFamily: null,
  messageFontFamily: "lato",
  tabletMessageFontFamily: null,
  mobileMessageFontFamily: null,

  width: "100",
  widthSuffix: "%",

  titleHorizontalAlign: "left",

  descriptionHorizontalAlign: "left",

  gap: 0,
  gapSuffix: "px",

  customCss: "",

  showCloseButtonAfter: 0,
  showCloseButtonAfterSuffix: "s",

  closeAlign: "topRight",

  closeSize: "small",
  closeCustomSize: 16,
  closeCustomSizeSuffix: "px",

  closeBgSize: 0,
  closeBgSizeSuffix: "px",
  tempCloseBgSize: 5,

  closeBorderRadiusShape: "square",
  tempCloseBorderRadiusShape: "square",

  closeBorderRadius: 0,
  closeBorderRadiusSuffix: "px",
  tempCloseBorderRadius: 2,

  closeHorizontalPosition: 20,
  closeHorizontalPositionSuffix: "px",

  closeVerticalPosition: 20,
  closeVerticalPositionSuffix: "px",

  borderRadiusType: "grouped",
  borderRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,

  tempBorderRadius: 2,
  tempBorderTopLeftRadius: 2,
  tempBorderTopRightRadius: 2,
  tempBorderBottomRightRadius: 2,
  tempBorderBottomLeftRadius: 2,

  borderRadiusSuffix: "px",
  borderTopLeftRadiusSuffix: "px",
  borderTopRightRadiusSuffix: "px",
  borderBottomRightRadiusSuffix: "px",
  borderBottomLeftRadiusSuffix: "px",

  tempBorderRadiusSuffix: "px",
  tempBorderTopLeftRadiusSuffix: "px",
  tempBorderTopRightRadiusSuffix: "px",
  tempBorderBottomRightRadiusSuffix: "px",
  tempBorderBottomLeftRadiusSuffix: "px",

  titleFontStyle: "",
  titleFontFamilyType: "google",
  titleFontSize: 20,
  titleFontSizeSuffix: "px",
  titleFontWeight: 700,
  titleLineHeight: 1.3,
  titleLetterSpacing: 0,
  titleVariableFontWeight: 400,
  titleFontWidth: 100,
  titleFontSoftness: 0,
  titleBold: false,
  titleItalic: false,
  titleUnderline: false,
  titleStrike: false,
  titleUppercase: false,
  titleLowercase: false,

  descriptionFontFamily: "",
  descriptionFontStyle: "",
  descriptionFontFamilyType: "google",
  descriptionFontSize: 13,
  descriptionFontSizeSuffix: "px",
  descriptionFontWeight: 400,
  descriptionLineHeight: 1.3,
  descriptionLetterSpacing: 0,
  descriptionVariableFontWeight: 400,
  descriptionFontWidth: 100,
  descriptionFontSoftness: 0,
  descriptionBold: false,
  descriptionItalic: false,
  descriptionUnderline: false,
  descriptionStrike: false,
  descriptionUppercase: false,
  descriptionLowercase: false,

  bgColorHex: "#1a86f2",
  bgColorOpacity: 1,
  bgColorPalette: "",

  tempBgColorOpacity: 1,
  tempBgColorPalette: "",

  titleColorHex: "",
  titleColorOpacity: 1,
  titleColorPalette: "",

  tempTitleColorOpacity: 1,
  tempTitleColorPalette: "",

  descriptionColorHex: "",
  descriptionColorOpacity: 1,
  descriptionColorPalette: "",

  tempDescriptionColorOpacity: 1,
  tempDescriptionColorPalette: "",

  borderColorHex: "#000000",
  borderColorOpacity: 1,
  borderColorPalette: "",
  borderStyle: "solid",
  borderWidthType: "",
  borderWidth: "",
  borderTopWidth: "",
  borderRightWidth: "",
  borderBottomWidth: "",
  borderLeftWidth: "",

  closeColorHex: "#000000",
  closeColorOpacity: 1,
  closeColorPalette: "",
  tempCloseColorOpacity: 1,
  tempCloseColorPalette: "",

  closeBgColorHex: "#000000",
  closeBgColorOpacity: 0,
  closeBgColorPalette: "",

  tempCloseBgColorOpacity: 1,
  tempCloseBgColorPalette: "",

  titleTextShadow: "",
  titleTextShadowBlur: 4,
  titleTextShadowColorHex: "#ff0000",
  titleTextShadowColorOpacity: 0,
  titleTextShadowColorPalette: "",
  titleTextShadowHorizontal: 2,
  titleTextShadowVertical: 2,

  hoverTitleTextShadowHorizontal: 2,
  hoverTitleTextShadowVertical: 2,
  hoverTitleTextShadowBlur: 4,
  hoverTitleTextShadowColorOpacity: 0,
  hoverTitleTextShadowColorHex: "#ff0000",

  tempHoverTitleTextShadowBlur: 4,
  tempHoverTitleTextShadowHorizontal: 2,
  tempHoverTitleTextShadowVertical: 2,

  descriptionTextShadowBlur: 4,
  descriptionTextShadowColorHex: "#ff0000",
  descriptionTextShadowColorOpacity: 0,
  descriptionTextShadowColorPalette: "",
  descriptionTextShadowHorizontal: 2,
  descriptionTextShadowVertical: 2,

  hoverDescriptionTextShadowHorizontal: 2,
  hoverDescriptionTextShadowVertical: 2,
  hoverDescriptionTextShadowBlur: 4,
  hoverDescriptionTextShadowColorOpacity: 0,
  hoverDescriptionTextShadowColorHex: "#ff0000",

  tempHoverDescriptionTextShadowBlur: 4,
  tempHoverDescriptionTextShadowHorizontal: 2,
  tempHoverDescriptionTextShadowVertical: 2,

  boxShadow: "",

  tempBoxShadow: "on",

  boxShadowColorHex: "#000000",
  boxShadowColorOpacity: 1,
  boxShadowColorPalette: "",

  tempBoxShadowColorOpacity: 1,
  tempBoxShadowColorPalette: "",

  boxShadowBlur: 0,
  boxShadowSpread: 0,
  boxShadowVertical: 0,
  boxShadowHorizontal: 0,

  tempBoxShadowBlur: 4,
  tempBoxShadowSpread: 0,
  tempBoxShadowVertical: 2,
  tempBoxShadowHorizontal: 1,

  tempTitleTextShadowBlur: 4,
  tempTitleTextShadowHorizontal: 2,
  tempTitleTextShadowColorOpacity: 1,
  tempTitleTextShadowVertical: 2,

  containerBoxShadow: "",
  tempContainerBoxShadow: "on",
  containerBoxShadowColorHex: "#000000",
  containerBoxShadowColorPalette: "",
  tempContainerBoxShadowColorPalette: "",
  containerBoxShadowColorOpacity: 1,
  tempContainerBoxShadowColorOpacity: 1,
  containerBoxShadowBlur: 0,
  tempContainerBoxShadowBlur: 4,
  containerBoxShadowSpread: 0,
  tempContainerBoxShadowSpread: 0,
  containerBoxShadowVertical: 0,
  tempContainerBoxShadowVertical: 2,
  containerBoxShadowHorizontal: 0,
  tempContainerBoxShadowHorizontal: 2,

  tabletContainerBoxShadow: "",
  tempTabletContainerBoxShadow: "on",
  tabletContainerBoxShadowColorHex: "#000000",
  tabletContainerBoxShadowColorPalette: "",
  tempTabletContainerBoxShadowColorPalette: "",
  tabletContainerBoxShadowColorOpacity: 1,
  tempTabletContainerBoxShadowColorOpacity: 1,
  tabletContainerBoxShadowBlur: 0,
  tempTabletContainerBoxShadowBlur: 4,
  tabletContainerBoxShadowSpread: 0,
  tempTabletContainerBoxShadowSpread: 0,
  tabletContainerBoxShadowVertical: 0,
  tempTabletContainerBoxShadowVertical: 2,
  tabletContainerBoxShadowHorizontal: 0,
  tempTabletContainerBoxShadowHorizontal: 2,

  mobileContainerBoxShadow: "",
  tempMobileContainerBoxShadow: "on",
  mobileContainerBoxShadowColorHex: "#000000",
  mobileContainerBoxShadowColorPalette: "",
  tempMobileContainerBoxShadowColorPalette: "",
  mobileContainerBoxShadowColorOpacity: 1,
  tempMobileContainerBoxShadowColorOpacity: 1,
  mobileContainerBoxShadowBlur: 0,
  tempMobileContainerBoxShadowBlur: 4,
  mobileContainerBoxShadowSpread: 0,
  tempMobileContainerBoxShadowSpread: 0,
  mobileContainerBoxShadowVertical: 0,
  tempMobileContainerBoxShadowVertical: 2,
  mobileContainerBoxShadowHorizontal: 0,
  tempMobileContainerBoxShadowHorizontal: 2,

  tempDescriptionTextShadowBlur: 4,
  tempDescriptionTextShadowHorizontal: 2,
  tempDescriptionTextShadowColorOpacity: 1,
  tempDescriptionTextShadowVertical: 2,

  tempBorderColorOpacity: 1,
  tempBorderColorPalette: "",
  tempBorderStyle: "solid",
  tempBorderWidth: "",
  tempBorderTopWidth: "",
  tempBorderRightWidth: "",
  tempBorderBottomWidth: "",
  tempBorderLeftWidth: "",

  hoverTransition: 50,
  hoverTransitionSuffix: "",

  tabletTitleFontStyle: null,
  tabletTitleFontSize: null,
  tabletTitleFontSizeSuffix: null,
  tabletTitleFontWeight: null,
  tabletTitleLetterSpacing: null,
  tabletTitleLineHeight: null,

  tabletDescriptionFontStyle: null,
  tabletDescriptionFontSize: null,
  tabletDescriptionFontSizeSuffix: null,
  tabletDescriptionFontWeight: null,
  tabletDescriptionLetterSpacing: null,
  tabletDescriptionLineHeight: null,

  mobileTitleFontStyle: null,
  mobileTitleFontSize: null,
  mobileTitleFontSizeSuffix: null,
  mobileTitleFontWeight: null,
  mobileTitleLetterSpacing: null,
  mobileTitleLineHeight: null,

  mobileDescriptionFontStyle: null,
  mobileDescriptionFontSize: null,
  mobileDescriptionFontSizeSuffix: null,
  mobileDescriptionFontWeight: null,
  mobileDescriptionLetterSpacing: null,
  mobileDescriptionLineHeight: null,

  alertPaddingType: "grouped",
  alertPadding: 15,
  alertPaddingSuffix: "px",

  alertPaddingTop: 15,
  alertPaddingTopSuffix: "px",

  alertPaddingRight: 15,
  alertPaddingRightSuffix: "px",

  alertPaddingBottom: 15,
  alertPaddingBottomSuffix: "px",

  alertPaddingLeft: 15,
  alertPaddingLeftSuffix: "px"
};
const modelWithAllDifferentValues = {
  title: "Title2",
  titlePopulation: "",
  titlePopulationEntityType: "",
  titlePopulationEntityId: "",

  description: "Description2",
  descriptionPopulation: "",
  descriptionPopulationEntityType: "",
  descriptionPopulationEntityId: "",

  closeButtonState: "off",
  descriptionState: "off",

  numberFontFamily: "arial",
  tabletNumberFontFamily: null,
  mobileNumberFontFamily: null,
  titleFontFamily: "arial",
  tabletTitleFontFamily: null,
  mobileTitleFontFamily: null,
  tabletDescriptionFontFamily: null,
  mobileDescriptionFontFamily: null,
  messageFontFamily: "arial",
  tabletMessageFontFamily: null,
  mobileMessageFontFamily: null,

  width: "300",
  widthSuffix: "px",

  titleHorizontalAlign: "center",

  descriptionHorizontalAlign: "center",

  gap: 10,
  gapSuffix: "px",

  customCss: "",

  showCloseButtonAfter: 1,
  showCloseButtonAfterSuffix: "s",

  closeAlign: "topLeft",

  closeSize: "mediul",
  closeCustomSize: 17,
  closeCustomSizeSuffix: "px",

  closeBgSize: 30,
  closeBgSizeSuffix: "px",
  tempCloseBgSize: 5,

  closeBorderRadiusShape: "square",
  tempCloseBorderRadiusShape: "square",

  closeBorderRadius: 50,
  closeBorderRadiusSuffix: "px",
  tempCloseBorderRadius: 2,

  closeHorizontalPosition: 30,
  closeHorizontalPositionSuffix: "px",

  closeVerticalPosition: 30,
  closeVerticalPositionSuffix: "px",

  borderRadiusType: "ungrouped",
  borderRadius: 1,
  borderTopLeftRadius: 2,
  borderTopRightRadius: 3,
  borderBottomRightRadius: 4,
  borderBottomLeftRadius: 5,

  tempBorderRadius: 2,
  tempBorderTopLeftRadius: 2,
  tempBorderTopRightRadius: 2,
  tempBorderBottomRightRadius: 2,
  tempBorderBottomLeftRadius: 2,

  borderRadiusSuffix: "px",
  borderTopLeftRadiusSuffix: "px",
  borderTopRightRadiusSuffix: "px",
  borderBottomRightRadiusSuffix: "px",
  borderBottomLeftRadiusSuffix: "px",

  tempBorderRadiusSuffix: "px",
  tempBorderTopLeftRadiusSuffix: "px",
  tempBorderTopRightRadiusSuffix: "px",
  tempBorderBottomRightRadiusSuffix: "px",
  tempBorderBottomLeftRadiusSuffix: "px",

  titleFontStyle: "",
  titleFontFamilyType: "google",
  titleFontSize: 25,
  titleFontSizeSuffix: "px",
  titleFontWeight: 400,
  titleLineHeight: 1.4,
  titleLetterSpacing: 0.1,
  titleVariableFontWeight: 700,
  titleFontWidth: 50,
  titleFontSoftness: 0,
  titleBold: true,
  titleItalic: true,
  titleUnderline: true,
  titleStrike: true,
  titleUppercase: true,
  titleLowercase: true,

  descriptionFontFamily: "",
  descriptionFontStyle: "",
  descriptionFontFamilyType: "google",
  descriptionFontSize: 23,
  descriptionFontSizeSuffix: "px",
  descriptionFontWeight: 700,
  descriptionLineHeight: 1.1,
  descriptionLetterSpacing: 1,
  descriptionVariableFontWeight: 700,
  descriptionFontWidth: 200,
  descriptionFontSoftness: 0,
  descriptionBold: true,
  descriptionItalic: true,
  descriptionUnderline: true,
  descriptionStrike: true,
  descriptionUppercase: true,
  descriptionLowercase: true,

  bgColorHex: "#1a85f2",
  bgColorOpacity: 0.5,
  bgColorPalette: "",

  tempBgColorOpacity: 1,
  tempBgColorPalette: "",

  titleColorHex: "#FF0000",
  titleColorOpacity: 0.5,
  titleColorPalette: "",

  tabletTitleColorHex: "#FF1000",
  tabletTitleColorOpacity: 0.7,

  mobileTitleColorHex: "#222222",
  mobileTitleColorOpacity: 0.1,

  tempTitleColorOpacity: 1,
  tempTitleColorPalette: "",

  descriptionColorHex: "#000000",
  descriptionColorOpacity: 0.4,
  descriptionColorPalette: "",

  tabletDescriptionColorHex: "#FF0000",
  tabletDescriptionColorOpacity: 0.7,

  mobileDescriptionColorHex: "#FF0500",
  mobileDescriptionColorOpacity: 0.2,

  tempDescriptionColorOpacity: 1,
  tempDescriptionColorPalette: "",

  borderColorHex: "#FF0000",
  borderColorOpacity: 0.4,
  borderColorPalette: "",
  borderStyle: "dashed",
  borderWidthType: "",
  borderWidth: "1",
  borderTopWidth: "2",
  borderRightWidth: "3",
  borderBottomWidth: "4",
  borderLeftWidth: "5",

  closeColorHex: "#FF0000",
  closeColorOpacity: 0.7,
  closeColorPalette: "",
  tempCloseColorOpacity: 1,
  tempCloseColorPalette: "",

  closeBgColorHex: "#FF0000",
  closeBgColorOpacity: 1,
  closeBgColorPalette: "",

  tempCloseBgColorOpacity: 1,
  tempCloseBgColorPalette: "",

  titleTextShadow: "on",
  titleTextShadowBlur: 5,
  titleTextShadowColorHex: "#f00000",
  titleTextShadowColorOpacity: 1,
  titleTextShadowColorPalette: "",
  titleTextShadowHorizontal: 3,
  titleTextShadowVertical: 3,

  hoverTitleTextShadowHorizontal: 3,
  hoverTitleTextShadowVertical: 3,
  hoverTitleTextShadowBlur: 3,
  hoverTitleTextShadowColorOpacity: 1,
  hoverTitleTextShadowColorHex: "#ff1000",

  tempHoverTitleTextShadowBlur: 2,
  tempHoverTitleTextShadowHorizontal: 3,
  tempHoverTitleTextShadowVertical: 3,

  descriptionTextShadowBlur: 5,
  descriptionTextShadowColorHex: "#ff1000",
  descriptionTextShadowColorOpacity: 1,
  descriptionTextShadowColorPalette: "",
  descriptionTextShadowHorizontal: 3,
  descriptionTextShadowVertical: 4,

  hoverDescriptionTextShadowHorizontal: 3,
  hoverDescriptionTextShadowVertical: 3,
  hoverDescriptionTextShadowBlur: 5,
  hoverDescriptionTextShadowColorOpacity: 1,
  hoverDescriptionTextShadowColorHex: "#ffa000",

  tempHoverDescriptionTextShadowBlur: 5,
  tempHoverDescriptionTextShadowHorizontal: 3,
  tempHoverDescriptionTextShadowVertical: 3,

  boxShadow: "on",

  tempBoxShadow: "on",

  boxShadowColorHex: "#FF0000",
  boxShadowColorOpacity: 0.7,
  boxShadowColorPalette: "",

  tempBoxShadowColorOpacity: 1,
  tempBoxShadowColorPalette: "",

  boxShadowBlur: 1,
  boxShadowSpread: 1,
  boxShadowVertical: 1,
  boxShadowHorizontal: 1,

  tempBoxShadowBlur: 4,
  tempBoxShadowSpread: 0,
  tempBoxShadowVertical: 2,
  tempBoxShadowHorizontal: 1,

  tempTitleTextShadowBlur: 4,
  tempTitleTextShadowHorizontal: 2,
  tempTitleTextShadowColorOpacity: 1,
  tempTitleTextShadowVertical: 2,

  containerBoxShadow: "",
  tempContainerBoxShadow: "on",
  containerBoxShadowColorHex: "#FF0000",
  containerBoxShadowColorPalette: "",
  tempContainerBoxShadowColorPalette: "",
  containerBoxShadowColorOpacity: 1,
  tempContainerBoxShadowColorOpacity: 1,
  containerBoxShadowBlur: 0,
  tempContainerBoxShadowBlur: 4,
  containerBoxShadowSpread: 0,
  tempContainerBoxShadowSpread: 0,
  containerBoxShadowVertical: 0,
  tempContainerBoxShadowVertical: 2,
  containerBoxShadowHorizontal: 0,
  tempContainerBoxShadowHorizontal: 2,

  tabletContainerBoxShadow: "",
  tempTabletContainerBoxShadow: "on",
  tabletContainerBoxShadowColorHex: "#000000",
  tabletContainerBoxShadowColorPalette: "",
  tempTabletContainerBoxShadowColorPalette: "",
  tabletContainerBoxShadowColorOpacity: 1,
  tempTabletContainerBoxShadowColorOpacity: 1,
  tabletContainerBoxShadowBlur: 0,
  tempTabletContainerBoxShadowBlur: 6,
  tabletContainerBoxShadowSpread: 0,
  tempTabletContainerBoxShadowSpread: 0,
  tabletContainerBoxShadowVertical: 0,
  tempTabletContainerBoxShadowVertical: 2,
  tabletContainerBoxShadowHorizontal: 0,
  tempTabletContainerBoxShadowHorizontal: 2,

  mobileContainerBoxShadow: "",
  tempMobileContainerBoxShadow: "on",
  mobileContainerBoxShadowColorHex: "#000000",
  mobileContainerBoxShadowColorPalette: "",
  tempMobileContainerBoxShadowColorPalette: "",
  mobileContainerBoxShadowColorOpacity: 0.5,
  tempMobileContainerBoxShadowColorOpacity: 1,
  mobileContainerBoxShadowBlur: 0,
  tempMobileContainerBoxShadowBlur: 4,
  mobileContainerBoxShadowSpread: 0,
  tempMobileContainerBoxShadowSpread: 0,
  mobileContainerBoxShadowVertical: 0,
  tempMobileContainerBoxShadowVertical: 2,
  mobileContainerBoxShadowHorizontal: 0,
  tempMobileContainerBoxShadowHorizontal: 2,

  tempDescriptionTextShadowBlur: 4,
  tempDescriptionTextShadowHorizontal: 2,
  tempDescriptionTextShadowColorOpacity: 1,
  tempDescriptionTextShadowVertical: 2,

  tempBorderColorOpacity: 1,
  tempBorderColorPalette: "",
  tempBorderStyle: "solid",
  tempBorderWidth: "",
  tempBorderTopWidth: "",
  tempBorderRightWidth: "",
  tempBorderBottomWidth: "",
  tempBorderLeftWidth: "",

  hoverTransition: 70,
  hoverTransitionSuffix: "",

  tabletTitleFontStyle: null,
  tabletTitleFontSize: null,
  tabletTitleFontSizeSuffix: null,
  tabletTitleFontWeight: null,
  tabletTitleLetterSpacing: null,
  tabletTitleLineHeight: null,

  tabletDescriptionFontStyle: null,
  tabletDescriptionFontSize: null,
  tabletDescriptionFontSizeSuffix: null,
  tabletDescriptionFontWeight: null,
  tabletDescriptionLetterSpacing: null,
  tabletDescriptionLineHeight: null,

  mobileTitleFontStyle: null,
  mobileTitleFontSize: null,
  mobileTitleFontSizeSuffix: null,
  mobileTitleFontWeight: null,
  mobileTitleLetterSpacing: null,
  mobileTitleLineHeight: null,

  mobileDescriptionFontStyle: null,
  mobileDescriptionFontSize: null,
  mobileDescriptionFontSizeSuffix: null,
  mobileDescriptionFontWeight: null,
  mobileDescriptionLetterSpacing: null,
  mobileDescriptionLineHeight: null,

  alertPaddingType: "grouped",
  alertPadding: 20,
  alertPaddingSuffix: "px",

  alertPaddingTop: 20,
  alertPaddingTopSuffix: "px",

  alertPaddingRight: 20,
  alertPaddingRightSuffix: "px",

  alertPaddingBottom: 20,
  alertPaddingBottomSuffix: "px",

  alertPaddingLeft: 20,
  alertPaddingLeftSuffix: "px"
};
const styles = {
  ".brz &&": {
    standart: ["cssStyleSizeWidth", "cssStyleBorderRadius"]
  },
  ".brz &&:hover": {
    standart: [
      "cssStyleBorder",
      "cssStyleBgColor",
      "cssStyleAlertContainerShadow"
    ],
    interval: ["cssStyleHoverTransition"]
  },
  ".brz && .brz-alert-title": {
    standart: [
      "cssStyleElementAlertTitleFontFamily",
      "cssStyleElementAlertTitleFontSize",
      "cssStyleElementAlertTitleLineHeight",
      "cssStyleElementAlertTitleFontWeight",
      "cssStyleElementAlertTitleLetterSpacing",
      "cssStyleElementAlertTitleFontVariation",
      "cssStyleElementAlertTitleTextTransform",
      "cssStyleDisplayBlock"
    ]
  },
  ".brz &&:hover .brz-alert-title": {
    standart: [
      "cssStyleElementAlertTitleColor",
      "cssStyleElementAlertTitleShadow"
    ],
    interval: ["cssStyleHoverTransition"]
  },
  ".brz && .brz-alert-description": {
    standart: [
      "cssStyleElementAlertDescriptionFontFamily",
      "cssStyleElementAlertDescriptionFontSize",
      "cssStyleElementAlertDescriptionLineHeight",
      "cssStyleElementAlertDescriptionFontWeight",
      "cssStyleElementAlertDescriptionLetterSpacing",
      "cssStyleElementAlertDescriptionFontVariation",
      "cssStyleElementAlertDescriptionTextTransform",
      "cssStyleDisplayBlock",
      "cssStyleElementAlertDescriptionVisibility",
      "cssStyleElementAlertDescriptionGap"
    ]
  },
  ".brz &&:hover .brz-alert-description": {
    standart: [
      "cssStyleElementAlertDescriptionColor",
      "cssStyleElementAlertDescriptionShadow"
    ],
    interval: ["cssStyleHoverTransition"]
  },
  ".brz && .brz-alert-close": {
    standart: [
      "cssStyleElementAlertCloseButtonVisibility",
      "cssStyleElementAlertCloseButtonSize",
      "cssStyleElementAlertCloseButtonBorderRadius"
    ]
  },
  ".brz && .brz-alert-close:hover": {
    standart: [
      "cssStyleElementAlertCloseButtonColor",
      "cssStyleElementAlertCloseButtonBgColor",
      "cssStyleBoxShadow"
    ],
    interval: ["cssStyleHoverTransition"]
  },
  ".brz && .brz-alert-close-icon": {
    standart: ["cssStyleElementAlertCloseButtonBgSize"]
  }
};

describe("Testing renderStyles fn", () => {
  test("Default styles", () => {
    expect(
      renderStyles({
        v: defaultValue,
        vs: defaultValue,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Default styles with some hover", () => {
    expect(
      renderStyles<ElementModel>({
        v: defaultValue,
        vs: defaultValue,
        vd: {
          ...defaultValue,
          hoverTitleColorHex: "#FF0000",
          hoverDescriptionColorOpacity: 0.5
        },
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(min-width:991px){.brz &&:hover .brz-alert-title{color:rgba(255, 0, 0, 1);}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Default styles with some tablet and mobile values", () => {
    expect(
      renderStyles<ElementModel>({
        v: defaultValue,
        vs: defaultValue,
        vd: {
          ...defaultValue,
          tabletTitleColorHex: "#FF0000",
          tabletDescriptionColorOpacity: 0.5,
          mobileTitleColorHex: "#FF0000",
          mobileDescriptionColorOpacity: 0.5
        },
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz && .brz-alert-title{color:rgba(255, 0, 0, 1);}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz && .brz-alert-title{color:rgba(255, 0, 0, 1);}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Rules styles", () => {
    expect(
      renderStyles({
        v: defaultValue,
        vs: {
          ...defaultValue,
          titleFontSize: 30,
          descriptionLineHeight: 1.4,
          descriptionLetterSpacing: 0.1
        },
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      ".brz && .brz-alert-title{font-size:30px;}.brz && .brz-alert-description{line-height:1.4;letter-spacing:0.1px;}",
      '.brz && .brz-alert-title{font-size:20px;}.brz && .brz-alert-description{line-height:1.3;letter-spacing:0px;}@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Rules styles with hover, tablet and mobile data", () => {
    expect(
      renderStyles<ElementModel>({
        v: defaultValue,
        vs: {
          ...defaultValue,
          hoverBorderColorHex: "#AB0000",
          hoverBorderColorOpacity: 0.1,
          tabletCloseColorHex: "#FF10000",
          tabletCloseColorOpacity: 0.2,
          mobileTitleTextShadowHorizontal: 5,
          mobileTitleTextShadowVertical: 7
        },
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      ".brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}@media(min-width:991px){.brz &&:hover{border:0px solid rgba(171, 0, 0, 0.1);}}@media(max-width:767px){.brz && .brz-alert-title{text-shadow:5px 7px 4px rgba(255, 0, 0, 0);}}",
      '.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Rules styles with hover, tablet and mobile data", () => {
    expect(
      renderStyles<ElementModel>({
        v: defaultValue,
        vs: {
          ...defaultValue,
          hoverBorderColorHex: "#AB0000",
          hoverBorderColorOpacity: 0.1,
          tabletCloseColorHex: "#FF10000",
          tabletCloseColorOpacity: 0.2,
          mobileTitleTextShadowHorizontal: 5,
          mobileTitleTextShadowVertical: 7
        },
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      ".brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}@media(min-width:991px){.brz &&:hover{border:0px solid rgba(171, 0, 0, 0.1);}}@media(max-width:767px){.brz && .brz-alert-title{text-shadow:5px 7px 4px rgba(255, 0, 0, 0);}}",
      '.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Custom styles", () => {
    expect(
      renderStyles({
        v: {
          ...defaultValue,
          descriptionTextShadowBlur: 5,
          descriptionTextShadowColorHex: "#ff1000",
          descriptionTextShadowColorOpacity: 1,
          descriptionTextShadowColorPalette: "",
          descriptionTextShadowHorizontal: 3
        },
        vs: defaultValue,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '.brz && .brz-alert-description{text-shadow:3px 2px 5px rgba(255, 16, 0, 1);}@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Custom styles with hover", () => {
    expect(
      renderStyles({
        v: {
          ...defaultValue,
          hoverDescriptionTextShadowHorizontal: 3,
          hoverDescriptionTextShadowVertical: 4,
          hoverDescriptionTextShadowBlur: 5,
          hoverDescriptionTextShadowColorOpacity: 1,
          hoverDescriptionTextShadowColorHex: "#ff5000"
        },
        vs: defaultValue,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:3px 4px 5px rgba(255, 80, 0, 1);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Custom styles with tablet and mobile", () => {
    expect(
      renderStyles<ElementModel>({
        v: {
          ...defaultValue,
          tabletBoxShadowBlur: 1,
          tabletBoxShadowSpread: 2,
          tabletBoxShadowVertical: 1,
          tabletBoxShadowHorizontal: 2,
          tabletBgColorHex: "#1a86f2",
          tabletBgColorOpacity: 1
        },
        vs: defaultValue,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}'
    ]);
  });

  test("Rules styles with all different values", () => {
    expect(
      renderStyles({
        v: defaultValue,
        vs: modelWithAllDifferentValues,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      '.brz &&{width:300px;border-radius:2px 3px 4px 5px;}.brz &&{border-width:2px 3px 4px 5px;border-style:dashed;border-color:rgba(255, 0, 0, 0.4);background-color:rgba(26, 133, 242, 0.5);}.brz && .brz-alert-title{font-size:25px;line-height:1.4;font-weight:400;letter-spacing:0.1px;font-variation-settings:"wght" 700, "wdth" 50, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;}.brz && .brz-alert-title{color:rgba(255, 0, 0, 0.5);text-shadow:3px 3px 5px rgba(240, 0, 0, 1);}.brz && .brz-alert-description{font-size:23px;line-height:1.1;font-weight:700;letter-spacing:1px;font-variation-settings:"wght" 700, "wdth" 200, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;display:none;padding-top:10px;}.brz && .brz-alert-description{color:rgba(0, 0, 0, 0.4);text-shadow:3px 4px 5px rgba(255, 16, 0, 1);}.brz && .brz-alert-close{display:none;}.brz && .brz-alert-close{color:rgba(255, 0, 0, 0.7);background-color:rgba(255, 0, 0, 1);box-shadow:1px 1px 1px 1px rgba(255, 0, 0, 0.7);;}.brz && .brz-alert-close-icon{padding:30px;}@media(min-width:991px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(min-width:991px){.brz &&:hover .brz-alert-title{text-shadow:3px 3px 3px rgba(255, 16, 0, 1);}.brz &&:hover .brz-alert-description{text-shadow:3px 3px 5px rgba(255, 160, 0, 1);}}@media(max-width:991px) and (min-width:768px){.brz && .brz-alert-title{color:rgba(255, 16, 0, 0.7);}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.7);}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(max-width:767px){.brz && .brz-alert-title{color:rgba(34, 34, 34, 0.1);}.brz && .brz-alert-description{color:rgba(255, 5, 0, 0.2);}}@media(max-width:767px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}',
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);}.brz && .brz-alert-title{font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(min-width:991px){.brz &&{width:100%;border-radius: 0px;}.brz &&:hover{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz &&:hover .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz &&:hover .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.50s;}.brz &&:hover .brz-alert-title{transition-duration:0.50s;}.brz &&:hover .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close:hover{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}'
    ]);
  });

  test("Custom styles with all different values", () => {
    expect(
      renderStyles<ElementModel>({
        v: {
          ...modelWithAllDifferentValues,
          titleFontStyle: "",
          titleFontFamilyType: "google",
          titleFontSize: 22,
          titleFontSizeSuffix: "px",
          titleFontWeight: 420,
          titleLineHeight: 1.3,
          titleLetterSpacing: 0.2,
          titleVariableFontWeight: 300,
          titleFontWidth: 70,
          titleFontSoftness: 1,
          titleBold: false,
          titleItalic: true,
          titleUnderline: false,
          titleStrike: true,
          titleUppercase: false,
          titleLowercase: true,
          bgColorHex: "#1a35f2",
          bgColorOpacity: 0.7,
          bgColorPalette: "",
          titleColorHex: "#FF0100",
          titleColorOpacity: 0.7,
          titleColorPalette: "",
          descriptionColorHex: "#FF0000",
          descriptionColorOpacity: 0.4,
          descriptionColorPalette: "",
          tabletBgColorHex: "#1a35f3",
          mobilebgColorOpacity: 0.9
        },
        vs: defaultValue,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      "",
      '.brz &&{width:300px;border-radius:2px 3px 4px 5px;}.brz &&{border-width:2px 3px 4px 5px;border-style:dashed;border-color:rgba(255, 0, 0, 0.4);background-color:rgba(26, 53, 242, 0.7);}.brz && .brz-alert-title{font-size:22px;font-weight:420;letter-spacing:0.2px;font-variation-settings:"wght" 300, "wdth" 70, "SOFT" 1;font-style:italic;text-decoration:line-through !important;text-transform:lowercase !important;}.brz && .brz-alert-title{color:rgba(255, 1, 0, 0.7);text-shadow:3px 3px 5px rgba(240, 0, 0, 1);}.brz && .brz-alert-description{font-size:23px;line-height:1.1;font-weight:700;letter-spacing:1px;font-variation-settings:"wght" 700, "wdth" 200, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;display:none;padding-top:10px;}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.4);text-shadow:3px 4px 5px rgba(255, 16, 0, 1);}.brz && .brz-alert-close{display:none;}.brz && .brz-alert-close{color:rgba(255, 0, 0, 0.7);background-color:rgba(255, 0, 0, 1);box-shadow:1px 1px 1px 1px rgba(255, 0, 0, 0.7);;}.brz && .brz-alert-close-icon{padding:30px;}@media(min-width:991px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(min-width:991px){.brz &&{width:300px;border-radius:2px 3px 4px 5px;}.brz &&:hover{border-width:2px 3px 4px 5px;border-style:dashed;border-color:rgba(255, 0, 0, 0.4);background-color:rgba(26, 53, 242, 0.7);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:22px;line-height:1.3;font-weight:420;letter-spacing:0.2px;font-variation-settings:"wght" 300, "wdth" 70, "SOFT" 1;font-style:italic;text-decoration:line-through !important;text-transform:lowercase !important;display:block;}.brz &&:hover .brz-alert-title{color:rgba(255, 1, 0, 0.7);text-shadow:3px 3px 3px rgba(255, 16, 0, 1);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:23px;line-height:1.1;font-weight:700;letter-spacing:1px;font-variation-settings:"wght" 700, "wdth" 200, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;display:block;display:none;padding-top:10px;}.brz &&:hover .brz-alert-description{color:rgba(255, 0, 0, 0.4);text-shadow:3px 3px 5px rgba(255, 160, 0, 1);}.brz && .brz-alert-close{display:none;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(255, 0, 0, 0.7);background-color:rgba(255, 0, 0, 1);box-shadow:1px 1px 1px 1px rgba(255, 0, 0, 0.7);;}.brz && .brz-alert-close-icon{padding:30px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.70s;}.brz &&:hover .brz-alert-title{transition-duration:0.70s;}.brz &&:hover .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close:hover{transition-duration:0.70s;}}@media(max-width:991px) and (min-width:768px){.brz &&{background-color:rgba(26, 53, 243, 0.7);}.brz && .brz-alert-title{color:rgba(255, 16, 0, 0.7);}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.7);}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(max-width:767px){.brz && .brz-alert-title{color:rgba(34, 34, 34, 0.1);}.brz && .brz-alert-description{color:rgba(255, 5, 0, 0.2);}}@media(max-width:767px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}'
    ]);
  });

  test("Rules and Custom mix", () => {
    expect(
      renderStyles<ElementModel>({
        v: {
          ...modelWithAllDifferentValues,
          titleFontStyle: "",
          titleFontFamilyType: "google",
          titleFontSize: 22,
          titleFontSizeSuffix: "px",
          titleFontWeight: 420,
          titleLineHeight: 1.3,
          titleLetterSpacing: 0.2,
          titleVariableFontWeight: 300,
          titleFontWidth: 70,
          titleFontSoftness: 1,
          titleBold: false,
          titleItalic: true,
          titleUnderline: false,
          titleStrike: true,
          titleUppercase: false,
          titleLowercase: true,
          bgColorHex: "#1a35f2",
          bgColorOpacity: 0.7,
          tabletBgColorOpacity: 1,
          mobileBgColorOpacity: 0.8,
          bgColorPalette: "",
          titleColorHex: "#FF0100",
          titleColorOpacity: 0.7,
          titleColorPalette: "",
          descriptionColorHex: "#FF0000",
          descriptionColorOpacity: 0.4,
          descriptionColorPalette: ""
        },
        vs: modelWithAllDifferentValues,
        vd: defaultValue,
        styles,
        store,
        contexts
      })
    ).toStrictEqual([
      '.brz &&{width:100%;border-radius: 0px;}.brz &&{border:0px solid rgba(0, 0, 0, 1);background-color:rgba(26, 134, 242, 1);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;}.brz && .brz-alert-title{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:13px;line-height:1.3;font-weight:400;letter-spacing:0px;font-variation-settings:"wght" 400, "wdth" 100, "SOFT" 0;text-transform:inherit !important;display:block;display:block;padding-top:0px;}.brz && .brz-alert-description{text-shadow:2px 2px 4px rgba(255, 0, 0, 0);}.brz && .brz-alert-close{display:block;font-size: 16px;border-radius:0px;}.brz && .brz-alert-close{color:rgba(0, 0, 0, 1);background-color:rgba(0, 0, 0, 0);box-shadow:none;}.brz && .brz-alert-close-icon{padding:0px;}@media(min-width:991px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}@media(max-width:767px){.brz &&{transition-duration:0.50s;}.brz && .brz-alert-title{transition-duration:0.50s;}.brz && .brz-alert-description{transition-duration:0.50s;}.brz && .brz-alert-close{transition-duration:0.50s;}}',
      '.brz &&{width:300px;border-radius:2px 3px 4px 5px;}.brz &&{border-width:2px 3px 4px 5px;border-style:dashed;border-color:rgba(255, 0, 0, 0.4);background-color:rgba(26, 133, 242, 0.5);}.brz && .brz-alert-title{font-size:25px;line-height:1.4;font-weight:400;letter-spacing:0.1px;font-variation-settings:"wght" 700, "wdth" 50, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;}.brz && .brz-alert-title{color:rgba(255, 0, 0, 0.5);text-shadow:3px 3px 5px rgba(240, 0, 0, 1);}.brz && .brz-alert-description{font-size:23px;line-height:1.1;font-weight:700;letter-spacing:1px;font-variation-settings:"wght" 700, "wdth" 200, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;display:none;padding-top:10px;}.brz && .brz-alert-description{color:rgba(0, 0, 0, 0.4);text-shadow:3px 4px 5px rgba(255, 16, 0, 1);}.brz && .brz-alert-close{display:none;}.brz && .brz-alert-close{color:rgba(255, 0, 0, 0.7);background-color:rgba(255, 0, 0, 1);box-shadow:1px 1px 1px 1px rgba(255, 0, 0, 0.7);;}.brz && .brz-alert-close-icon{padding:30px;}@media(min-width:991px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(min-width:991px){.brz &&:hover .brz-alert-title{text-shadow:3px 3px 3px rgba(255, 16, 0, 1);}.brz &&:hover .brz-alert-description{text-shadow:3px 3px 5px rgba(255, 160, 0, 1);}}@media(max-width:991px) and (min-width:768px){.brz && .brz-alert-title{color:rgba(255, 16, 0, 0.7);}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.7);}}@media(max-width:991px) and (min-width:768px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}@media(max-width:767px){.brz && .brz-alert-title{color:rgba(34, 34, 34, 0.1);}.brz && .brz-alert-description{color:rgba(255, 5, 0, 0.2);}}@media(max-width:767px){.brz &&{transition-duration:0.70s;}.brz && .brz-alert-title{transition-duration:0.70s;}.brz && .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close{transition-duration:0.70s;}}',
      '.brz &&{background-color:rgba(26, 53, 242, 0.7);}.brz && .brz-alert-title{font-size:22px;line-height:1.3;font-weight:420;letter-spacing:0.2px;font-variation-settings:"wght" 300, "wdth" 70, "SOFT" 1;font-style:italic;text-decoration:line-through !important;text-transform:lowercase !important;}.brz && .brz-alert-title{color:rgba(255, 1, 0, 0.7);}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.4);}@media(min-width:991px){.brz &&{width:300px;border-radius:2px 3px 4px 5px;}.brz &&:hover{border-width:2px 3px 4px 5px;border-style:dashed;border-color:rgba(255, 0, 0, 0.4);background-color:rgba(26, 53, 242, 0.7);box-shadow:none;}.brz && .brz-alert-title{font-family:\'Lato\', sans-serif;font-size:22px;line-height:1.3;font-weight:420;letter-spacing:0.2px;font-variation-settings:"wght" 300, "wdth" 70, "SOFT" 1;font-style:italic;text-decoration:line-through !important;text-transform:lowercase !important;display:block;}.brz &&:hover .brz-alert-title{color:rgba(255, 1, 0, 0.7);}.brz && .brz-alert-description{font-family:\'Lato\', sans-serif;font-size:23px;line-height:1.1;font-weight:700;letter-spacing:1px;font-variation-settings:"wght" 700, "wdth" 200, "SOFT" 0;font-weight:bold;font-style:italic;text-decoration:underline line-through !important;text-transform:uppercase !important;display:block;display:none;padding-top:10px;}.brz &&:hover .brz-alert-description{color:rgba(255, 0, 0, 0.4);}.brz && .brz-alert-close{display:none;border-radius:0px;}.brz && .brz-alert-close:hover{color:rgba(255, 0, 0, 0.7);background-color:rgba(255, 0, 0, 1);box-shadow:1px 1px 1px 1px rgba(255, 0, 0, 0.7);;}.brz && .brz-alert-close-icon{padding:30px;}}@media(min-width:991px){.brz &&:hover{transition-duration:0.70s;}.brz &&:hover .brz-alert-title{transition-duration:0.70s;}.brz &&:hover .brz-alert-description{transition-duration:0.70s;}.brz && .brz-alert-close:hover{transition-duration:0.70s;}}@media(max-width:991px) and (min-width:768px){.brz &&{background-color:rgba(26, 53, 242, 1);}.brz && .brz-alert-title{color:rgba(255, 16, 0, 0.7);}.brz && .brz-alert-description{color:rgba(255, 0, 0, 0.7);}}@media(max-width:767px){.brz &&{background-color:rgba(26, 53, 242, 0.8);}.brz && .brz-alert-title{color:rgba(34, 34, 34, 0.1);}.brz && .brz-alert-description{color:rgba(255, 5, 0, 0.2);}}'
    ]);
  });
});

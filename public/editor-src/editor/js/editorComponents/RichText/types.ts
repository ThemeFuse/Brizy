import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import { TooltipPlacement } from "visual/component/Tooltip/types";
import { TypographyTags } from "visual/editorComponents/RichText/toolbar/utils";
import { Switch } from "visual/types/Options";
import { TextScripts } from "visual/types/Style";
import type {
  Value as LinkValue,
  PopulationColor as PopulationColorType
} from "./utils/dependencies";

export interface Value extends ElementModel, LinkValue {
  text: string;
  textPopulation: string;
  className: string;
  popups: Array<ElementModelType2>;
  dcLinkPopupPopups: Array<ElementModelType2>;
  customCSS: string;

  tooltipOffset: number;
  tooltipPlacement: TooltipPlacement;
  tooltipText: string;

  tag: string;

  color: {
    hex: string;
    opacity: number;
    colorPalette: string;
  };
  colorOpacity: number;
  populationColor: PopulationColorType | string;

  textShadowColorPalette?: string;
  textShadowColorOpacity: number;
  textShadowColorHex: string;
  textShadowHorizontal: number;
  textShadowVertical: number;
  textShadowBlur: number;
}

export interface Patch extends Partial<Value> {
  typographyFontStyle?: string;
  backgroundImage?: Partial<BackgroundImage>;

  [k: string]: unknown;
}

//TODO: Need to Move in RichTexts/Formats/BackgroundImages after conversion in TS
export interface BackgroundImage {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageExtension: string;
  imageFileName: string;
  imagePositionX: number;
  imagePositionY: number;
  // Not know exact type
  imagePopulation: null | string;
  positionX: number;
  positionY: number;
  imagePopulationEntityType?: string;
  imagePopulationEntityId?: string;
}

export interface Gradient {
  startHex: string;
  startOpacity: string;
  startPalette?: string;
  finishHex?: string;
  finishOpacity?: string;
  finishPalette?: string;
  activePointer?: string;
  type?: "linear-gradient" | "radial-gradient";
  linearAngle?: string;
  radialPosition?: string;
  startPointer?: string;
  finishPointer?: string;
  linearDegree?: string;
  radialDegree?: string;
}

export interface Color {
  hex: null | string;
  opacity: number;
  colorPalette: null;
}

type PopulationColor = {
  [key in Lowercase<TypographyTags>]: Color;
};

// Not sure if the Return Types from quill is Correct
export interface QuillFormat {
  "uniq-id"?: string;
  "generated-css"?: string;
  contentHorizontalAlign?: string;
  typographyFontStyle?: string;
  typographyFontFamily?: string;
  typographyFontFamilyType?: string;
  typographyFontSize?: string;
  typographyFontSizeSuffix?: string;
  typographyFontWeight?: string;
  typographyLetterSpacing?: string;
  typographyLineHeight?: string;
  typographyVariableFontWeight?: string;
  typographyFontWidth?: string;
  typographyFontSoftness?: string;
  list?: string;
  underline?: boolean;
  strike?: boolean;
  italic?: boolean;
  bold?: boolean;
  color?: string;
  background?: string;
  tabletBackground?: string;
  mobileBackground?: string;
  shadow?: string;
  typographyUnderline?: string;
  typographyItalic?: string;
  typographyBold?: string;
  typographyStrike?: string;
  capitalize?: string;
  typographyUppercase?: string;
  typographyScript?: string;
  script?: TextScripts;

  tooltip?: string;
  enableTooltip?: Switch;
  tooltipTriggerClick?: Switch;
  tooltipText?: string;

  opacity?: string;
  colorPalette?: string;
  populationColor?: PopulationColor;
  prepopulation?: string;
  textBgColorPalette?: string;
  link?: string;
  backgroundImage?: BackgroundImage;
  typographyLowercase?: unknown;
  shadowColorPalette?: unknown;
  textBackgroundGradient?: Gradient;
  population?: string;
  backgroundGradient?: Gradient;
  header?: unknown;
  pre?: unknown;
  tabletColor?: string;
  tabletBackgroundGradient?: Gradient;
  tabletTextBackgroundGradient?: Gradient;
  mobileColor?: string;
  mobileBackgroundGradient?: Gradient;
  mobileTextBackgroundGradient?: Gradient;
}

export interface PrepopulationData {
  show: boolean;
  index: number | null;
}

export interface TooltipFormat {
  enableTooltip?: Switch;
  tooltipId?: string;
}

export interface TooltipAttributes {
  tooltipText: string;
  tooltipPlacement: string;
  tooltipOffset: string;
  tooltipTriggerClick: Switch;
}

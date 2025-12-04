import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import { TooltipPlacement } from "visual/component/Tooltip/types";
import { TypographyTags } from "visual/editorComponents/RichText/toolbar/utils";
import { Switch } from "visual/types/Options";
import { TextScripts } from "visual/types/Style";
import type { Value as LinkValue } from "./utils/dependencies";

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
}

export interface Patch extends Partial<Value> {
  typographyFontStyle?: string;
  backgroundImage?: {
    imagePopulationEntityType: string;
  };

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
}

interface Gradient {
  startHex: string;
  startOpacity: string;
}

interface Color {
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

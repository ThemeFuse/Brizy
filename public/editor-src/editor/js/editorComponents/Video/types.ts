import type { ElementModel } from "visual/component/Elements/Types";

export enum VideoTypes {
  Youtube = "youtube",
  Vimeo = "vimeo",
  Custom = "custom",
  URL = "url"
}

export enum Ratio {
  R1_1 = "1:1",
  R3_2 = "3:2",
  R4_3 = "4:3",
  R9_16 = "9:16",
  R16_9 = "16:9",
  R21_9 = "21:9"
}

export interface ChoiceTypes {
  title: string;
  value: string;
}

export interface Value extends ElementModel {
  bgColorHex: string;
  bgColorPalette: string;
  borderColorOpacity: number;

  borderColorHex: string;
  borderColorPalette: string;
  bgColorOpacity: number;

  coverImageSrc: string;

  type: VideoTypes;
  ratio: Ratio;
}

export interface BgPaddingFlags {
  isControlsEnabled: boolean;
  isCustomVideo: boolean;
}

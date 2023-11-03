import { DeviceMode } from "visual/types";
import { ModelFamilyType } from "visual/utils/fonts/getFontById";

type Switch = "on" | "off";

export interface FontStyleState {
  device: DeviceMode;
  active: boolean;
}

export interface FontStyleProps {
  title: string;
  fontFamilyType: ModelFamilyType;
  fontFamily: string;
  fontSizeSuffix: string;
  tabletFontSizeSuffix: string;
  mobileFontSizeSuffix: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
  numItems: number;

  deleted: boolean;
  showDeleteIcon?: boolean;

  deletable: Switch;
  onChange: (data: Partial<FontStyleProps>) => void;
  itemIndex: number;
  animationCounter: number;
  deviceMode: DeviceMode;

  setDeviceMode: (device: DeviceMode) => void;
}

export interface FontStyleEditorState {
  brzNewItem: boolean;
  numItems: number;
  animationCounter: number;
}

export interface FontStyleEditorData extends FontStyleProps {
  deleted: boolean;
  id: string;
  deletable: Switch;
}

interface FontStyleEditorValue {
  fontStyles: FontStyleEditorData[];
  extraFontStyles: FontStyleEditorData[];
}

export interface FontStyleEditorProps {
  value: FontStyleEditorValue;
  onChange: (value: FontStyleEditorData[]) => void;
}

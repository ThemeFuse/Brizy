import { DeviceMode } from "visual/types";
import { ModelFamilyType } from "visual/utils/fonts/getFontById";
import { CSSProperties } from "react";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

type Switch = "on" | "off";

export interface Family {
  fontFamily: string;
  fontFamilyType: string;
}

interface StyleCommon extends Family {
  fontSizeSuffix: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface Styles extends StyleCommon {
  fontFamilyType: ModelFamilyType;
  tabletFontSizeSuffix: string;
  mobileFontSizeSuffix: string;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
}

export interface FontStyleProps {
  title: string;
  numItems: number;
  deleted: boolean;
  showDeleteIcon?: boolean;
  deletable: Switch;
  onChange: (data: Partial<FontStyleEditorItem>) => void;
  itemIndex: number;
  animationCounter: number;
  deviceMode: DeviceMode;
  setDeviceMode: (device: DeviceMode) => void;
  sampleStyle: CSSProperties;
  toolbarItems: () => OptionDefinition[];
  className?: string;
}

export interface FontStyleEditorItem extends StyleCommon {
  deletable: Switch;
  deleted: boolean;
  id: string;
  title: string;
  tabletFontSizeSuffix: string;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontSizeSuffix: string;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
}

export interface FontStyleEditorData extends FontStyleProps {
  deleted: boolean;
  id: string;
  deletable: Switch;
}

interface FontStyleEditorValue {
  fontStyles: FontStyleEditorData[];
  extraFontStyles: FontStyleEditorData[];
  className?: string;
}

export interface Props {
  value: FontStyleEditorValue;
  label?: JSX.Element;
  onChange: (value: FontStyleEditorData[]) => void;
}

export interface ModelType {
  [key: string]: Styles;
}

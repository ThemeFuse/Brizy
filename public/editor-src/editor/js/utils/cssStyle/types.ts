import { ElementModel } from "visual/component/Elements/Types";
import { OptionName } from "visual/component/Options/types";
import { GenericToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { State } from "visual/utils/stateMode";
import { BreakpointsNames } from "../breakpoints/types";

export type OptionsStyleFunctions =
  | "border"
  | "backgroundColor"
  | "colorPicker"
  | "boxShadow"
  | "corners";

export type AllCSSKeys = BreakpointsNames | Exclude<State, "normal">;

export type OutputStyle = [string, string, string];

export interface OutputOptionStyle {
  [k: string]: { [k: string]: string };
}

export interface Styles {
  [k: string]: {
    interval?: string[];
    standart?: string[];
  };
}

export type GeneratedCSS<T> = Record<AllCSSKeys, T[]>;

export type Option = GenericToolbarItemType<OptionName>;

export type OptionStyle = (v: ElementModel) => OutputOptionStyle;

export interface SelectorAndCSSObject {
  selector: string;
  css: string;
}

export interface GeneratedCSSItem {
  [k: string]: string[];
}

export type CSS = GeneratedCSS<GeneratedCSSItem>;

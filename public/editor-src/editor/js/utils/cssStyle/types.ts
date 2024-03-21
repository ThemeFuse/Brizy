import {
  OptionMeta,
  OptionName,
  OptionValue
} from "visual/component/Options/types";
import { GenericToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { State } from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { BreakpointsNames } from "../breakpoints/types";

export type AllCSSKeys = BreakpointsNames | Exclude<State, "normal">;

export type OutputStyle = [string, string, string];

export interface Styles {
  [k: string]: {
    interval?: string[];
    standart?: string[];
  };
}

export interface OutputOptionStyle {
  [k: string]: { [k: string]: Literal };
}

export type GeneratedCSS<T> = Record<AllCSSKeys, T[]>;

export type Option<T extends OptionName = OptionName> =
  GenericToolbarItemType<T>;

export type OptionStyle<T extends OptionName = OptionName> = (data: {
  meta?: Partial<OptionMeta<T>>;
  value: OptionValue<T>;
}) => OutputOptionStyle;

export interface SelectorAndCSSObject {
  selector: string;
  css: string;
}

export interface GeneratedCSSItem {
  [k: string]: string[];
}

export type CSS = GeneratedCSS<GeneratedCSSItem>;

export type CSSStyleFn<T extends OptionName = OptionName> = (data: {
  meta?: Partial<OptionMeta<T>>;
  value: OptionValue<T>;
}) => string;

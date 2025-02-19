import {
  OptionMeta,
  OptionName,
  OptionValue
} from "visual/component/Options/types";
import { GenericToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { State } from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { BreakpointsNames } from "../breakpoints/types";

export type AllCSSKeys = BreakpointsNames | Exclude<State, "normal">;

export type OutputStyle = [string, string, string];

export interface Styles {
  [k: string]: {
    interval?: string[];
    standart?: string[];
  };
}

export interface StyleCSSProperties {
  [k: string]: Literal;
}

export interface OutputOptionStyle {
  [k: string]: StyleCSSProperties;
}

export type GeneratedCSS<T> = Record<AllCSSKeys, T[]>;

export type Option<T extends OptionName = OptionName> =
  GenericToolbarItemType<T>;

export interface OptionStyleData<T extends OptionName = OptionName> {
  meta?: Partial<OptionMeta<T>>;
  value: OptionValue<T>;
}

export type OptionStyle<T extends OptionName = OptionName> = (
  data: OptionStyleData<T>
) => MValue<OutputOptionStyle>;

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
  config: ConfigCommon;
}) => string;

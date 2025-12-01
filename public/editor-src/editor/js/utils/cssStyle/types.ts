import { ElementModel, ModelType } from "visual/component/Elements/Types";
import {
  OptionMeta,
  OptionName,
  OptionValue
} from "visual/component/Options/types";
import { GenericToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { WithRenderContext } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { StylesContexts } from "visual/types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { CSSValue } from "visual/utils/style2/types";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import { BreakpointsNames } from "../breakpoints/types";

export type AllCSSKeys = BreakpointsNames | Exclude<State, "normal">;

export type OutputStyle = [string, string, string];
export type OutputStyleWithSymbol = [string, string, string, string?];

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

export interface Devices {
  desktop: number;
  tablet: number;
  mobile: number;
}

export type StoryDevices = Pick<Devices, "desktop">;

export type LoopCases = Array<{ device: ResponsiveMode; state: State }>;

export interface RenderStylesData<T extends ElementModel = ElementModel> {
  v: T;
  vs: T;
  vd: T;
  styles: Styles;
  props?: Record<string, unknown>;
  store: Store;
  contexts: StylesContexts;
}

export interface OnStyles {
  [key: string]: (data: CSSValue & WithRenderContext) => string;
}

export type GeneratorCSSObject = {
  [key in State]: {
    // selector
    [k in string]: {
      // cssStyleFn
      [k in string]: Partial<{
        [k in ResponsiveMode]: string;
      }>;
    };
  };
};

export interface CSSOutputData<T extends ElementModel = ElementModel> {
  v: T;
  vs: T;
  vd: T;
  styles: Styles;
  editorMode: EditorMode;
  cssData: {
    [k in ModelType]: GeneratorCSSObject;
  };
}

export type CSSOutputResult = {
  [k in ModelType]: string;
};

export interface AssignStyleData {
  objToAssign: GeneratorCSSObject;
  css: string;
  selector: string;
  state: State;
  device: ResponsiveMode;
  cssStyleFn: string;
}

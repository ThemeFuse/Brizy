import { FC } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { ExtraFontStyle } from "visual/types/Style";
import { WithClassName, WithConfig } from "visual/types/attributes";

export interface Config {
  blockType: "normal" | "popup";
  blockId: string;
  title: string;
  tooltipContent: string;
  icon: string;
}

export interface Props
  extends OptionProps<undefined>,
    WithClassName,
    WithConfig<Config> {}

export interface Selector {
  isAuthorized: boolean;
  pageBlocks: {
    items: Array<Block>;
  };
  extraFontStyles: ReduxState["extraFontStyles"];
}

export type Component = FC<Props>;

export interface GetBlock {
  pageItems: Block[];
  blockId: Config["blockId"];
  blockType: Config["blockType"];
}

export interface HandleCreateBlock {
  block: Block;
  blockId: Config["blockId"];
  blockType: Config["blockType"];
  extraFontStyles: ExtraFontStyle[];
  config: ConfigCommon;
}

export interface Error {
  message: string;
  type: "error";
}

export interface Warn {
  message: string;
  type: "warn";
  hideAfter?: number;
}

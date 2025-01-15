import { FC } from "react";
import * as Option from "visual/component/Options/Type";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlock, Page } from "visual/types";
import { WithClassName, WithConfig } from "visual/types/attributes";

export interface OpenPromptCondition {
  type: "block" | "popup";
  blockId: Config["_id"];
  rules: GlobalBlock["rules"];
}

export interface Config {
  _id: string;
  parentId?: string;
  blockType: "normal" | "popup" | "externalPopup";
}

export type Props = Option.Props<undefined> &
  WithConfig<Config> &
  WithClassName;

export interface Selector {
  extraFontStyles: ReduxState["extraFontStyles"];
  pageBlocks: Block[];
  blocksData: { [key: string]: Block };
  globalBlocks: { [key: string]: GlobalBlock };
  page: Page | undefined;
}

export type Component = FC<Props>;

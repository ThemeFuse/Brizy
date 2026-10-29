import type { FC } from "react";
import type * as Option from "visual/component/Options/Type";
import type { ReduxState } from "visual/redux/types";
import type { WithClassName, WithConfig } from "visual/types/attributes";
import type { Block } from "visual/types/Block";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { Page } from "visual/types/Page";

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

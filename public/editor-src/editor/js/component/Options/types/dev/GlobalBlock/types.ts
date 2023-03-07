import { FC } from "react";
import * as Option from "visual/component/Options/Type";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlock, Page, Screenshot } from "visual/types";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";

export interface OpenPromptCondition {
  _id: Config["_id"];
  type: "block" | "popup";
}

export interface GlobalBlockMeta {
  type: Config["blockType"];
  extraFontStyles: [];
  _thumbnailSrc?: string;
  _thumbnailWidth?: number;
  _thumbnailHeight?: number;
  _thumbnailTime?: number;
}

export interface PageBlocks {
  blocks: Block[];
  meta?: Screenshot;
}

export interface APIGlobalBlockData {
  data?: {
    uid: string;
    data: string;
    dataVersion: number;
    meta: string;
    rules: [];
    position: null | string;
  };
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

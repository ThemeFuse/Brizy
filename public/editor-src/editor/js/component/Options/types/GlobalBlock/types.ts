import { HTMLAttributes } from "react";
import { Block, GlobalBlock, Page, Screenshot } from "visual/types";
import { ReduxState } from "visual/redux/types";

export type GlobalBlockMeta = {
  type: GlobalBlockProps["blockType"];
  extraFontStyles: [];
  _thumbnailSrc?: string;
  _thumbnailWidth?: number;
  _thumbnailHeight?: number;
  _thumbnailTime?: number;
};

export type PageBlocks = {
  blocks: Block[];
  meta?: Screenshot;
};

export type APIGlobalBlockData = {
  data?: {
    uid: string;
    data: string;
    dataVersion: number;
    meta: string;
    rules: [];
    position: null | string;
  };
};

export type GlobalBlockProps = {
  blockType: "normal" | "popup" | "externalPopup";
  display: "block" | "inline";
  helperContent: string;
  value: {
    _id: string;
    parentId?: string;
  };
  className?: string;
  attr?: HTMLAttributes<Element>;
  label?: string;
  helper?: boolean;
} & GlobalBlockMapDispatch &
  GlobalBlockMapProps;

export type GlobalBlockMapProps = {
  extraFontStyles: ReduxState["extraFontStyles"];
  pageBlocks: Block[];
  blocksData: { [key: string]: Block };
  globalBlocks: { [key: string]: GlobalBlock };
  page: Page | undefined;
};

export type GlobalBlockMapDispatch = {
  makeNormalToGlobalBlock: (data: GlobalBlock) => void;
  makeGlobalToNormalBlock: (data: {
    block: Block;
    fromBlockId: string;
  }) => void;
  makePopupToGlobalBlock: (data: GlobalBlock) => void;
  makeGlobalBlockToPopup: (data: {
    block: Block;
    fromBlockId: string;
    parentId: string;
  }) => void;
};

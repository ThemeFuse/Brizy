import { Block } from "./Block";
import { Rule } from "./Rule";
import { ExtraFontStyle } from "./Style";

export type GlobalBlockPosition = {
  align: "top" | "bottom";
  top: number;
  bottom: number;
};

export type BlockMetaType = "normal" | "popup";

type Dependency = string;

export interface GlobalBlockBase {
  uid: string;
  data: Block & { deleted?: boolean };
  status: "draft" | "publish";
  rules: Rule[];
  position: GlobalBlockPosition | null;
  dataVersion: number;
  title?: string;
  tags?: string;

  // Used for Internal Global Popup(GlobalBlock -> Button -> GlobalPopup)
  dependencies: Array<Dependency>;
}

export interface GlobalBlockNormal extends GlobalBlockBase {
  meta: {
    type: "normal";
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export interface GlobalBlockPopup extends GlobalBlockBase {
  meta: {
    type: "popup";
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export type GlobalBlock = GlobalBlockNormal | GlobalBlockPopup;

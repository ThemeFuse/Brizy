import type { Block, BlockHtmlWithId } from "./Block";
import type { Rule } from "./Rule";
import type { ExtraFontStyle } from "./Style";

export type GlobalBlockPosition = {
  align: "top" | "bottom";
  top: number;
  bottom: number;
};

export type BlockMetaType = "normal" | "popup" | "overlay";

export type OverlaySubtype = "cookieBanner";

type Dependency = string;

export interface GlobalBlockBase {
  uid: string;
  data: Block & {
    deleted?: boolean;
    editorVersion?: string;
  };
  status: "draft" | "publish" | "scheduled";
  rules: Rule[];
  position: GlobalBlockPosition | null;
  dataVersion: number;
  title?: string;
  tags?: string;
  blocks?: Array<BlockHtmlWithId>;

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

export interface GlobalBlockOverlay extends GlobalBlockBase {
  meta: {
    type: "overlay";
    // Set by the CMS that creates overlay blocks; the reader keeps a block
    // whose subtype is missing or unknown rather than dropping it.
    subtype: OverlaySubtype | undefined;
    extraFontStyles: ExtraFontStyle[];
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
}

export type GlobalBlock =
  | GlobalBlockNormal
  | GlobalBlockPopup
  | GlobalBlockOverlay;

import type {
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "visual/bootstraps/compiler/common/transforms/assets";
import type { AdobeFont, GoogleFont, SystemFont, UploadedFont } from "./Fonts";
import type { Screenshot } from "./Screenshot";

export type Block = {
  type: string;
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  value: any;
  blockId: string;
  deleted?: boolean;
  meta?: Screenshot;
};

export interface UsedFonts {
  fonts: {
    google: Array<GoogleFont>;
    upload: Array<UploadedFont>;
    system: Array<SystemFont>;
    adobe: Array<AdobeFont>;
  };
  adobeKitId?: string;
}

export type BlockHtml = {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
};

export type PublishedBlockHtml = { html: "" };

export type BlocksHTML = BlockHtml | PublishedBlockHtml;

export type BlockHtmlWithId = BlocksHTML & { id: string };

import {
  AdobeFont,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import {
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../transforms/assets";

export interface UsedFonts {
  fonts: {
    google: Array<GoogleFont>;
    upload: Array<UploadedFont>;
    system: Array<SystemFont>;
    adobe: Array<AdobeFont>;
  };
  adobeKitId?: string;
}

export interface Output {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
}

type Block = Output & {
  id: string;
};

export interface GlobalBlockStatic {
  uid: string;
  blocks: Array<Block>;
}

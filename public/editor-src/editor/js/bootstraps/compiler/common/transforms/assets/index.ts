import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { AdobeFont, GoogleFont, UploadedFont } from "visual/types/Fonts";
import { makeScripts } from "./makeScripts";
import { makeStyles } from "./makeStyles";

export interface Fonts {
  google: GoogleFont[];
  upload: UploadedFont[];
  adobe: AdobeFont[];
}

export interface AssetCommon {
  attr?: Record<string, string>;
}

export interface AssetFile extends AssetCommon {
  type: "file";
  url: string;
}

export interface AssetInline extends AssetCommon {
  type: "inline";
  content: string;
}

export interface AssetCode {
  type: "code";
  content: string;
}

export interface Asset {
  name: string;
  score: number;
  content: AssetFile | AssetInline | AssetCode;
  pro: boolean;
}

export interface AssetGoogle {
  name: "google";
  type: "google-font";
  score: number;
  content: {
    type: "file";
    url: string;
    attr: Record<string, string>;
  };
  pro: boolean;
}

export interface AssetUpload {
  name: "upload";
  type: "uploaded-font";
  score: number;
  content: {
    type: "file";
    url: string;
    attr: Record<string, string>;
  };
  pro: boolean;
}

export interface AssetAdobe {
  name: "adobe";
  type: "adobe-font";
  score: number;
  content: {
    type: "file";
    url: string;
    attr: Record<string, string>;
  };
  pro: boolean;
}

export interface AssetLibsMap extends Asset {
  selectors: string[];
}

export type AssetFonts = AssetGoogle | AssetUpload | AssetAdobe;

export interface StylesFree {
  main: Asset;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
  pageFonts: AssetFonts[];
  pageStyles: Asset[];
}

export interface StylesPro {
  main: Asset;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
}

export interface ScriptsFree {
  main: Asset;
  version: string;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
}

export interface ScriptsPro {
  main: Asset;
  version: string;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
}

interface CSS {
  className: string;
  cssText: string;
}

export type DynamicCSS = {
  default: Array<CSS>;
  rules: Array<CSS>;
  custom: Array<CSS>;
};

interface Data {
  $root: cheerio.Root;
  fonts: Fonts;
  css: DynamicCSS;
  config: ConfigCommon;
  extra?: { adobeKitId?: string };
}

type GetAssets = (data: Data) => {
  freeStyles: StylesFree;
  freeScripts: ScriptsFree;
  proStyles?: StylesPro;
  proScripts?: ScriptsPro;
};

export const getAssets: GetAssets = (data) => {
  const { free: freeStyles, pro: proStyles } = makeStyles(data);
  const { free: freeScripts, pro: proScripts } = makeScripts(
    data.$root,
    data.config
  );

  return {
    freeStyles,
    freeScripts,
    ...(proStyles && { proStyles }),
    ...(proScripts && { proScripts })
  };
};

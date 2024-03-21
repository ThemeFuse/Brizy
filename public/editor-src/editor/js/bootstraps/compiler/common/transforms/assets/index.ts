import { GoogleFont, UploadedFont } from "visual/types";
import { makeScripts } from "./makeScripts";
import { makeStyles } from "./makeStyles";

export interface Fonts {
  google: GoogleFont[];
  upload: UploadedFont[];
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

export interface AssetLibsMap extends Asset {
  selectors: string[];
}

export type AssetFonts = AssetGoogle | AssetUpload;

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
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
}

export interface ScriptsPro {
  main: Asset;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
}

interface CSS {
  className: string;
  cssText: string;
  node?: HTMLElement;
}

export type DynamicCSS = Map<string, CSS>;

interface Data {
  $root: cheerio.Root;
  fonts: Fonts;
  css: DynamicCSS;
}

type GetAssets = (data: Data) => {
  freeStyles: StylesFree;
  freeScripts: ScriptsFree;
  proStyles?: StylesPro;
  proScripts?: ScriptsPro;
};

export const getAssets: GetAssets = (data) => {
  const { free: freeStyles, pro: proStyles } = makeStyles(data);
  const { free: freeScripts, pro: proScripts } = makeScripts(data.$root);

  return {
    freeStyles,
    freeScripts,
    ...(proStyles && { proStyles }),
    ...(proScripts && { proScripts })
  };
};

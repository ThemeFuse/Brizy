import * as cheerio from "cheerio";
import { makeStyles } from "./makeStyles";
import { makeScripts } from "./makeScripts";
import { GoogleFont, UploadedFont } from "../../../../types";

export type Fonts = {
  google: GoogleFont[];
  upload: UploadedFont[];
};

export type Asset = {
  name: string;
  score: number;
  content: string;
  pro: boolean;
};

export type AssetGoogle = {
  name: "google";
  type: "google-font";
  score: number;
  content: string;
  pro: boolean;
};

export type AssetUpload = {
  name: "upload";
  type: "uploaded-font";
  score: number;
  content: string;
  pro: boolean;
};

export type AssetLibsMap = Asset & {
  selectors: string[];
};

export type AssetFonts = AssetGoogle | AssetUpload;

export type StylesFree = {
  main: Asset;
  generic: Asset[];
  libsMap: Asset[];
  libsSelectors: string[];
  pageFonts: AssetFonts[];
  pageStyles: Asset[];
};

export type StylesPro = {
  main: Asset;
  generic: Asset[];
  libsMap: Asset[];
  libsSelectors: string[];
};

export type ScriptsFree = {
  main: Asset;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
};

export type ScriptsPro = {
  main: Asset;
  generic: Asset[];
  libsMap: AssetLibsMap[];
  libsSelectors: string[];
};

type GetAssets = (
  $: cheerio.CheerioAPI,
  f: Fonts
) => {
  freeStyles: StylesFree;
  freeScripts: ScriptsFree;
  proStyles?: StylesPro;
  proScripts?: ScriptsPro;
};

export const getAssets: GetAssets = ($, fonts) => {
  const { free: freeStyles, pro: proStyles } = makeStyles($, fonts);
  const { free: freeScripts, pro: proScripts } = makeScripts($);

  return {
    freeStyles,
    freeScripts,
    ...(proStyles && { proStyles }),
    ...(proScripts && { proScripts })
  };
};

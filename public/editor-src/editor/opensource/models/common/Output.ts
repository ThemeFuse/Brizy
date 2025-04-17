import { Page } from "../Page";
import { Project } from "../Project";

//#region Assets

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

//#endregion

//#region Page

export interface PageOutput {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
}

export interface PageDataOutput extends Page {
  compiled?: PageOutput;
}

//#endregion

//#region Project

interface ProjectOutput {
  styles: Array<Asset>;
}

export interface ProjectDataOutput extends Project {
  compiled?: ProjectOutput;
}

//#endregion

export interface Output {
  pageData: PageDataOutput;
  projectData: ProjectDataOutput;
  error?: string;
  popupSettings?: {
    verticalAlign: "top" | "bottom" | "center";
    horizontalAlign: "left" | "right" | "center";
  };
}

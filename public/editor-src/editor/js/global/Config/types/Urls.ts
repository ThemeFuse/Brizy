interface UrlsCommon {
  about: string;
  api: string;
  projectCloneLink: string;
  assets: string;
  customFile: string;
  editorFonts: string;
  prefetchFonts?: string;
  pagePreview: string;
  preview: string;
  site: string;
  support: string;
  templateFonts: string;
  upgradeToPro: string;
  editorIcons: string;
  worker: string;
  collaborationToolUrl?: string;
  templateIcons: string;

  // On Compile time
  compileAssets?: string;
  compileTemplateIcons?: string;
  compileTemplateIconsPlaceholder?: string;
}

interface WPUrls extends UrlsCommon {
  assetsExternal: string;
  blockThumbnails: string;
  changeTemplate: string;
  dashboardNavMenu: string;
  pluginSettings: string;
  templateThumbnails: string;
}

interface CloudUrls extends UrlsCommon {
  accountApprove: string;
  accountCreate: string;
  favicon: string;
  screenshot: string;
  siteOriginal: string;
  projectSettings: string;
  prefetchFonts: string;
  flags: string;
  worker: string;
}

type Cnf = {
  cloud: CloudUrls;
  wp: WPUrls;
};

export type Urls<T extends "wp" | "cloud"> = Cnf[T];

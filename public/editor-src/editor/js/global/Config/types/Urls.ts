interface UrlsCommon {
  about: string;
  api: string;
  projectCloneLink: string;
  assets: string;
  customFile: string;
  editorFonts: string;
  pagePreview: string;
  preview: string;
  site: string;
  support: string;
  templateFonts: string;
  upgradeToPro: string;
  editorIcons: string;
  worker: string;
  collaborationToolUrl?: string;
}

interface WPUrls extends UrlsCommon {
  assetsExternal: string;
  backToDashboard: string;
  blockThumbnails: string;
  changeTemplate: string;
  dashboardNavMenu: string;
  pluginSettings: string;
  templateIcons: string;
  templateThumbnails: string;
}

interface CloudUrls extends UrlsCommon {
  accountApprove: string;
  accountCreate: string;
  favicon: string;
  screenshot: string;
  siteOriginal: string;
  projectSettings: string;
  backToDashboard: string | undefined;
  prefetchFonts: string;
  flags: string;
  worker: string;
}

type Cnf = {
  cloud: CloudUrls;
  wp: WPUrls;
};

export type Urls<T extends "wp" | "cloud"> = Cnf[T];

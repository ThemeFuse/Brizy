interface UrlsCommon {
  about: string;
  api: string;
  assets: string;
  backToDashboard: string;
  customFile: string;
  editorFonts: string;
  image: string;
  pagePreview: string;
  site: string;
  support: string;
  templateFonts: string;
  upgradeToPro: string;
  editorIcons: string;
}

interface WPUrls extends UrlsCommon {
  assetsExternal: string;
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
}

type Cnf = {
  cloud: CloudUrls;
  wp: WPUrls;
};

export type Urls<T extends "wp" | "cloud"> = Cnf[T];

// blocks

export type BlockMetaType = "normal" | "popup";

export type Block = {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockId: string;
};

export type Rule = {
  type: 1 | 2;
  appliedFor: number | null;
  entityType: string;
  entityValues: (number | string)[];
};

export type GlobalBlock = {
  data: Block & { deleted?: boolean };
  status: "draft" | "publish";
  dataVersion: number;
  rules: Rule[];
  position: GlobalBlockPosition | null;
  meta: {
    type: BlockMetaType;
    extraFontStyles: Array<{ id: string }>;
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
};

export type SavedBlock = {
  data: Block;
  dataVersion: number;
  meta: {
    type: BlockMetaType;
    extraFontStyles: Array<{ id: string }>;
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
};

export type SavedLayout = {
  data: PageCommon["data"];
  dataVersion: number;
  meta: {
    type: BlockMetaType;
    extraFontStyles: Array<{ id: string }>;
    _thumbnailSrc?: string;
    _thumbnailWidth?: number;
    _thumbnailHeight?: number;
    _thumbnailTime?: number;
  };
};

export type GlobalBlockPosition = {
  align: "top" | "bottom";
  top: number;
  bottom: number;
};

//#region Page

export type DataCommon = {
  id: string;
  data: {
    items: Block[];
    [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  dataVersion: number;
  status: "draft" | "publish";
  title: string;
};

export type PageCommon = DataCommon & {
  slug: string;
};

export type PageWP = PageCommon & {
  _kind: "wp";
  is_index: boolean; // TODO: would be nice if WP and cloud types would match
  template: string;
  url: string; // TODO: find out what is this for
};

export type PopupWP = PageWP;

export type PageCloud = PageCommon & {
  _kind: "cloud";
  description: string;
  is_index: 1 | 0; // TODO: would be nice if WP and cloud types would match
  project: number;
  type: string;
};

export type ExternalStoryCloud = Omit<DataCommon, "title"> & {
  slug: string;
};

export type ExternalPopupCloud = Omit<DataCommon, "title">;

export type InternalPopupCloud = DataCommon & {
  rules: Rule[];
  project: number;
};

export type PageCloudCMS = PageCommon & {
  _kind: "cloud-cms";
  collectionType: {
    id: string;
    title: string;
  };
  fields:
    | {
        id: string;
        values: unknown;
        type: {
          collectionType: {
            id: string;
            title: string;
          };
        };
      }[]
    | null;
};

export type PopupCloudCMS = PageCloudCMS & {
  rules: Rule[];
};

export type Page =
  | PageWP
  | PageCloud
  | PageCloudCMS
  | InternalPopupCloud
  | ExternalPopupCloud
  | PopupCloudCMS;

//#endregion

// fonts

export type GoogleFont = {
  kind: "webfonts#webfont";
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: {
    [k: string]: string;
  };
  brizyId: string;
  deleted?: boolean;
};

export type UploadedFont = {
  id: string;
  family: string;
  type: "uploaded";
  weights: string[];
  brizyId: string;
  deleted?: boolean;
};

// authorized

export type Authorized = "pending" | "connected" | "disconnect";

// syncAllowed

export type SyncAllowed = boolean;

// deviceMode

export type DeviceMode = "desktop" | "tablet" | "mobile";

// screenshot

export type Screenshot = {
  _thumbnailSrc: string;
  _thumbnailWidth: number;
  _thumbnailHeight: number;
  _thumbnailTime: number;
};

// style

export type FontStyle = {
  deletable: "off" | "on";
  id: string;
  title: string;
  fontFamily: string;
  fontFamilyType: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  tabletFontSize: number;
  tabletFontWeight: number;
  tabletLineHeight: number;
  tabletLetterSpacing: number;
  mobileFontSize: number;
  mobileFontWeight: number;
  mobileLineHeight: number;
  mobileLetterSpacing: number;
};

export type Palette = {
  id:
    | "color1"
    | "color2"
    | "color3"
    | "color4"
    | "color5"
    | "color6"
    | "color7"
    | "color8";
  hex: "string";
};

export type Style = {
  id: string;
  title: string;
  fontStyles: FontStyle[];
  colorPalette: Palette[];
};

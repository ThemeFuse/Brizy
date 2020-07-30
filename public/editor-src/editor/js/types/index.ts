// blocks

import "react";

declare module "react" {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    loading?: "auto" | "eager" | "lazy";
  }
}

export type BlockMetaType = "normal" | "popup";

export type Block = {
  type: string;
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  blockId: string;
};

export type GlobalBlock = {
  data: Block & { deleted?: boolean };
  status: "draft" | "publish";
  dataVersion: number;
  rules: {
    type: 1 | 2;
    appliedFor: number;
    entityType: string;
    entityValues: number[];
  }[];
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

// page

type PageCommon = {
  id: string;
  data: {
    items: Block[];
    [k: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  title: string;
  slug: string;
  status: "draft" | "publish";
  dataVersion: number;
};
export type PageWP = PageCommon & {
  is_index: boolean; // TODO: would be nice if WP and cloud types would match
  template: string;
  url: string; // TODO: find out what is this
};
export type PageCloud = PageCommon & {
  is_index: 1 | 0; // TODO: would be nice if WP and cloud types would match
  project: number;
  description: string;
  type: string;
};

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
};
export type UploadedFont = {
  id: string;
  family: string;
  type: "uploaded";
  weights: string[];
  brizyId: string;
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

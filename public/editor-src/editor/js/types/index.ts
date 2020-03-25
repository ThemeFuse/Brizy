// blocks

export type Block = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  blockId: string;
};
export type GlobalBlock = {
  id: string;
  data: Block;
  dataVersion: number;
};

export type SavedBlock = GlobalBlock;

// page

type PageCommon = {
  id: string;
  data: object;
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

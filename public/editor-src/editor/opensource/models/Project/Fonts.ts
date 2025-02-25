export type FontFamilyType = "google" | "upload" | "adobe" | "system";

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

export type AdobeFont = {
  brizyId?: string;
  id: string;
  family: string;
  category: string;
  subsets: string[];
  variants: string[];
};

export type SystemFont = {
  brizyId: string;
  id: string;
  family: string;
  category: string;
  weights: string[];
};

export type UploadedFont = {
  id: string;
  family: string;
  type: "uploaded";
  weights: string[];
  brizyId: string;
  deleted?: boolean;
  variations?: VariationFont[];
};

export type Font = GoogleFont | UploadedFont | AdobeFont | SystemFont;

export type VariationFont = {
  tag: string;
  min: number;
  max: number;
};

export interface Fonts {
  config?: {
    data: GoogleFont[];
  };
  blocks?: {
    data: GoogleFont[];
  };
  google?: {
    data: GoogleFont[];
  };
  adobe?: {
    id: string;
    data: AdobeFont[];
  };
  system?: {
    data: SystemFont[];
  };
  upload?: {
    data: UploadedFont[];
  };
}

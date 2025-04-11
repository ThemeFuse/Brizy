interface FontFile {
  [type: string]: {
    [fileType: string]: File | null;
  };
}

interface VariationFont {
  tag: string;
  min: number;
  max: number;
}

export interface UploadFont {
  brizyId: string;
  type: "uploaded";
  family: string;
  files: FontFile;
  id: string;
  weights: string[];
  variations?: VariationFont[];
}

export interface CreateFontResponse {
  data: UploadFont;
  status: number;
}

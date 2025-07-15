export interface FontFile {
  [type: string]: {
    [fileType: string]: File | null;
  };
}

export interface UploadFont {
  brizyId: string;
  type: "uploaded";
  family: string;
  files: FontFile;
  id: string;
  weights: string[];
}

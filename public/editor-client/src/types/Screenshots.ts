import { Response } from "./Response";

export interface ScreenshotData {
  base64: string;
  blockType: "normal" | "global" | "saved" | "layout";
}

export type ScreenshotType = {
  _thumbnailSrc: string;
  type: string;
};

export interface Screenshots {
  getScreenshotUrl?: ({ _thumbnailSrc, type }: ScreenshotType) => string;
  create?: (
    res: Response<{ id: string }>,
    rej: Response<string>,
    extra: ScreenshotData
  ) => void;
  update?: (
    res: Response<{ id: string }>,
    rej: Response<string>,
    extra: ScreenshotData & { id: string }
  ) => void;
}

import { Response } from "../common";

export interface ScreenshotExtra {
  base64: string;
  blockType: "normal" | "global" | "saved" | "layout";
}

export interface ScreenshotRes {
  id: string;
}

export interface Screenshots {
  screenshotUrl?: string;
  create?: (
    res: Response<ScreenshotRes>,
    rej: Response<string>,
    extra: ScreenshotExtra
  ) => void;
  update?: (
    res: Response<ScreenshotRes>,
    rej: Response<string>,
    extra: ScreenshotExtra & ScreenshotRes
  ) => void;
}

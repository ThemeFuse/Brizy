import { Response } from "./Response";

export interface ScreenshotData {
  base64: string;
  blockType: "normal" | "global" | "saved" | "layout";
}

export interface Screenshots {
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

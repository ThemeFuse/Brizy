import { Response } from "../types/Response";

export interface ShortcodeContent {
  handler: (
    res: Response<string>,
    rej: Response<string>,
    shortcode: string
  ) => void;
}

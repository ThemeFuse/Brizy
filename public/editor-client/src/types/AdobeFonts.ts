import { Response } from "./Response";

export interface AdobeFonts {
  get?: (res: Response<unknown>, rej: Response<string>) => void;
  add?: (
    res: Response<unknown>,
    rej: Response<string>,
    extra: { group: string; key: string }
  ) => void;
}

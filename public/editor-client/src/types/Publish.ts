import { PublishData } from "./Project";
import { Response } from "./Response";

export interface Publish {
  handler: (
    res: Response<PublishData>,
    rej: Response<string>,
    args: PublishData
  ) => void;
}

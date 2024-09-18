import { Output } from "@/types/utils";
import { Response } from "./Response";

export interface GlobalBlock {
  uid: string;
  data: Record<string, unknown>;
  meta: Record<string, unknown>;
  rules: Array<Record<string, unknown>>;
  position: Record<string, unknown> | null;
  status: string;
  compiled?: Output;
  title?: string;
  tags?: string;
}

export interface GlobalBlockConfig {
  create?: (
    res: Response<GlobalBlock>,
    rej: Response<string>,
    extra: GlobalBlock
  ) => void;
}

//#endregion

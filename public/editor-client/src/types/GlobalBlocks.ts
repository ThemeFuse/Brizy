import { Rule } from "@/types/PopupConditions";
import { Output } from "@/types/utils";
import { Response, ResponseWithSuccessStatus } from "./Response";

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
  dependencies?: Record<string, unknown>;
}

export interface UpdateGlobalBlockRules {
  uid: string;
  rules: Array<Rule>;
  dataVersion: number;
}

export interface GlobalBlockConfig {
  create?: (
    res: Response<GlobalBlock>,
    rej: Response<string>,
    extra: GlobalBlock
  ) => void;
  delete?: (
    res: Response<ResponseWithSuccessStatus>,
    rej: Response<string>,
    uid: string
  ) => void;
  updateRules?: (
    res: Response<Array<Rule>>,
    rej: Response<string>,
    extra: UpdateGlobalBlockRules
  ) => void;
}

//#endregion

import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { ApiRule } from "visual/utils/api/adapter";
import type { Response, SuccessResponse } from "../common";

//#region Base

type _GB = Omit<GlobalBlock, "rules">;

export type Block = _GB & {
  rules: Array<ApiRule>;
};

//#endregion

//#region GlobalBlocks

export interface Extra {
  id: string;
}

export interface APIGlobalBlocks {
  create?: (res: Response<Block>, rej: Response<string>, extra: Block) => void;
  delete?: (res: Response<Block>, rej: Response<string>, uid: string) => void;
  updateRules?: (
    res: Response<SuccessResponse>,
    rej: Response<string>,
    extra: {
      uid: string;
      rules: Array<ApiRule>;
      dataVersion: number;
      status: GlobalBlock["status"];
    }
  ) => void;
}

//#endregion

//#region GlobalPopups

export interface APIGlobalPopups {
  create?: (res: Response<Block>, rej: Response<string>, extra: Block) => void;
}

//#endregion

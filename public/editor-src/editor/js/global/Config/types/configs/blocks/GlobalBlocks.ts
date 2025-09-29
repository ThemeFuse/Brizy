import { GlobalBlock } from "visual/types/GlobalBlock";
import { ApiRule } from "visual/utils/api/adapter";
import { Response } from "../common";

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
}

//#endregion

//#region GlobalPopups

export interface APIGlobalPopups {
  create?: (res: Response<Block>, rej: Response<string>, extra: Block) => void;
}

//#endregion

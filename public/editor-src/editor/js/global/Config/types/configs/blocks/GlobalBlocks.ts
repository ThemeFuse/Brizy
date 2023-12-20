import { Response } from "../common";

//#region Base

export interface Block {
  id: string;
  data: string;
  status: string;
  rules: string;
  position: string | null;
  meta: string;
  title?: string;
  tags?: string;
}

//#endregion

//#region GlobalBlocks

export interface Extra {
  id: string;
}

export interface APIGlobalBlocks {
  create?: (res: Response<Block>, rej: Response<string>, extra: Block) => void;
}

//#endregion

//#region GlobalPopups

export interface APIGlobalPopups {
  create?: (res: Response<Block>, rej: Response<string>, extra: Block) => void;
}

//#endregion

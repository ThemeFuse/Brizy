import { Literal } from "@/utils/types";
import { Response } from "./Response";

export interface CSSSymbol {
  uid: string;
  componentClassName: string;
  childrenClassName?: string;
  // INFO: the correct type should be `ElementTypes` from editor, but is not ok to import here from editor
  type: string;
  model: {
    component: Record<string, unknown>;
    children?: Record<string, unknown>;
  };
}

export interface DBSymbol {
  uid: string;
  label: string;
  version: Literal;
  data: {
    type: string;
    className: string;
    model: Record<string, unknown>;
  };
}

export enum SymbolAction {
  Create = "CREATE",
  Update = "UPDATE",
  DELETE = "DELETE"
}

export interface SymbolCreate {
  type: SymbolAction.Create;
  payload: CSSSymbol;
}

export interface SymbolUpdate {
  type: SymbolAction.Update;
  payload: CSSSymbol;
}

export interface SymbolDelete {
  type: SymbolAction.DELETE;
  payload: string;
}

export type SymbolsAction = SymbolCreate | SymbolUpdate | SymbolDelete;

export interface Symbols {
  get: (res: Response<DBSymbol[]>, rej: Response<string>) => void;
  add: (res: Response<void>, rej: Response<string>, data: CSSSymbol[]) => void;
  update: (
    res: Response<void>,
    rej: Response<string>,
    data: CSSSymbol[]
  ) => void;
  delete: (res: Response<void>, rej: Response<string>, data: string[]) => void;
}

import { Response } from "./Response";

export interface ClassSymbol {
  uid: string;
  label: string;
  data: { className: string; type: string; model: Record<string, unknown> };
  version: string;
}

export interface SymbolCreateResponse {
  success: boolean;
  data?: ClassSymbol[];
}

export interface SymbolUpdateResponse {
  success: boolean;
  data?: ClassSymbol[];
}

export interface SymbolDeleteResponse {
  success: boolean;
}

interface SymbolCreate {
  type: "CREATE";
  payload: ClassSymbol;
}

interface SymbolUpdate {
  type: "UPDATE";
  payload: ClassSymbol;
}

interface SymbolDelete {
  type: "DELETE";
  payload: string;
}

export type SymbolAction = SymbolCreate | SymbolUpdate | SymbolDelete;

export interface Symbols {
  get: (res: Response<ClassSymbol[]>, rej: Response<string>) => void;
  create: (
    res: Response<ClassSymbol[]>,
    rej: Response<string>,
    extra: ClassSymbol[]
  ) => void;
  update: (
    res: Response<ClassSymbol[]>,
    rej: Response<string>,
    extra: ClassSymbol[]
  ) => void;
  delete: (
    res: Response<boolean>,
    rej: Response<string>,
    extra: { uid: string }
  ) => void;
}

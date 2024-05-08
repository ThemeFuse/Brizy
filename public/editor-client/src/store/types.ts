import { CSSSymbol } from "../types/Symbols";

export interface State {
  symbols: {
    toCreate: CSSSymbol[];
    toUpdate: CSSSymbol[];
    toDelete: string[];
  };
}

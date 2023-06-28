import { ClassSymbol } from "src/types/Symbols";

export interface State {
  symbols: {
    toCreate: ClassSymbol[];
    toUpdate: ClassSymbol[];
    toDelete: ClassSymbol[];
  };
}

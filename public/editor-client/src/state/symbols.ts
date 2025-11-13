import { CSSSymbol } from "@/types/Symbols";
import { proxy } from "valtio";

export interface SymbolStatePart {
  type: "create" | "update" | "remove";
  symbol: CSSSymbol;
}

export interface SymbolState {
  current: SymbolStatePart[];
  _published: CSSSymbol[];
}

export const symbolsState = proxy<SymbolState>({
  current: [],
  _published: []
});

import type { Asset, CSS } from "./index";
import { SYMBOL_CSS } from "./scores";

export type SymbolAsset = Omit<Asset, "pro"> & {
  attr: {
    class: string;
  };
};

export const makeSymbols = (symbols: CSS[]): SymbolAsset[] =>
  symbols.map((symbol) => ({
    name: "symbol",
    score: SYMBOL_CSS,
    content: {
      type: "inline",
      content: symbol.cssText
    },
    attr: {
      class: symbol.className
    }
  }));

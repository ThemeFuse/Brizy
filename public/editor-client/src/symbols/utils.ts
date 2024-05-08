import { CSSSymbol } from "@/types/Symbols";

export const getIndex = (id: string, symbols: CSSSymbol[]): number =>
  symbols.findIndex(({ uid }) => id === uid);

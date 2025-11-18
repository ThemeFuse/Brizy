import { SymbolState } from "@/state/symbols";
import { CSSSymbol } from "@/types/Symbols";

export const beforeSymbolsUpdate = (symbolsState: SymbolState): CSSSymbol[] => {
  const updateCandidates = symbolsState.current.filter(
    (s) => s.type === "update"
  );

  return updateCandidates.map((candidate) => {
    const publishedSymbol = symbolsState._published.find(
      (published) => published.uid === candidate.symbol.uid
    );

    if (publishedSymbol) {
      return {
        ...candidate.symbol,
        version: (publishedSymbol.version || 1) + 1
      };
    } else {
      return {
        ...candidate.symbol,
        version: (candidate.symbol.version || 0) + 1
      };
    }
  });
};

export const afterSymbolsUpdate = (
  symbolsState: SymbolState,
  updateResults: CSSSymbol[]
): void => {
  const updatedUids = updateResults.map((candidate) => candidate.uid);

  symbolsState.current = symbolsState.current.filter(
    (symbol) => !updatedUids.includes(symbol.symbol.uid)
  );

  updateResults.forEach((updatedSymbol) => {
    const existingIndex = symbolsState._published.findIndex(
      (published) => published.uid === updatedSymbol.uid
    );
    if (existingIndex >= 0) {
      symbolsState._published[existingIndex] = updatedSymbol;
    } else {
      symbolsState._published.push(updatedSymbol);
    }
  });
};

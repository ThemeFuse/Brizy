import {
  createSymbols,
  deleteSymbols,
  getSymbolsByUid,
  getSymbolsList
} from "@/api";
import { symbolsState } from "@/state/symbols";
import { CSSSymbol } from "@/types/Symbols";

interface Symbols {
  getList: () => Promise<Array<CSSSymbol>>;
  getByUid: (uid: string[]) => Promise<CSSSymbol[]>;
  create: (symbols: CSSSymbol[]) => void;
  update: (symbol: CSSSymbol) => void;
  remove: (symbols: CSSSymbol[]) => void;
}

export const symbols: Symbols = {
  getList: getSymbolsList,
  getByUid: getSymbolsByUid,
  create: async (symbols: CSSSymbol[]) => {
    if (symbols.length > 0) {
      try {
        const createdSymbols = await createSymbols(symbols);

        if (createdSymbols.length > 0) {
          symbolsState._published.push(...createdSymbols);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to create symbols:", error);
        }
      }
    }
  },
  update: async (symbol: CSSSymbol) => {
    try {
      const alreadyExists = symbolsState.current.find(
        (s) => s.type === "update" && s.symbol.uid === symbol.uid
      );

      if (alreadyExists) {
        symbolsState.current = symbolsState.current.map((s) =>
          s.type === "update" && s.symbol.uid === symbol.uid
            ? { type: "update", symbol }
            : s
        );
      } else {
        symbolsState.current.push({ type: "update", symbol });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to update symbol:", error);
      }
    }
  },
  remove: async (symbols: CSSSymbol[]) => {
    const uids = symbols.map((symbol) => symbol.uid);

    const idsToDelete: string[] = uids;

    uids.forEach((uid) => {
      const foundInCurrent = symbolsState.current.find(
        (symbolPart) => symbolPart.symbol.uid === uid
      );

      if (foundInCurrent) {
        symbolsState.current = symbolsState.current.filter(
          (symbolPart) => symbolPart.symbol.uid !== uid
        );
      }

      const foundInPublish = symbolsState._published.find(
        (publishedSymbol) => publishedSymbol.uid === uid
      );

      if (foundInPublish) {
        symbolsState._published = symbolsState._published.filter(
          (symbol) => symbol.uid !== uid
        );
      }
    });

    if (idsToDelete.length > 0) {
      try {
        await deleteSymbols(idsToDelete);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to delete symbols:", error);
        }
      }
    }
  }
};

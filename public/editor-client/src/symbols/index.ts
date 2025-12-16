import {
  createSymbols,
  deleteSymbols,
  getSymbolsByUid,
  getSymbolsList,
  updateSymbols
} from "@/api";
import { CSSSymbol } from "@/types/Symbols";

interface Symbols {
  getList: () => Promise<Array<CSSSymbol>>;
  getByUid: (uid: string[]) => Promise<CSSSymbol[]>;
  create: (symbols: CSSSymbol[]) => Promise<CSSSymbol[]>;
  update: (symbols: CSSSymbol[]) => void;
  remove: (symbols: CSSSymbol[]) => void;
}

export const symbols: Symbols = {
  getList: getSymbolsList,
  getByUid: getSymbolsByUid,
  create: async (symbols: CSSSymbol[]) => {
    if (symbols.length > 0) {
      try {
        console.log("symbols on create: ", symbols);
        const createdSymbols = await createSymbols(symbols);

        return createdSymbols;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to create symbols:", error);
        }
      }
    }

    return [];
  },
  update: async (symbols: CSSSymbol[]) => {
    if (symbols.length > 0) {
      try {
        console.log("symbols on update: ", symbols);
        await updateSymbols(symbols);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to update symbols:", error);
        }
      }
    }
  },
  remove: async (symbols: CSSSymbol[]) => {
    console.log("symbols on delete: ", symbols);

    const uids = symbols.map((symbol) => symbol.uid);

    if (uids.length > 0) {
      try {
        await deleteSymbols(uids);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to delete symbols:", error);
        }
      }
    }
  }
};

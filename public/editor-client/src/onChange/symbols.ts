import { isSymbol } from "src/symbols/utils";
import { SymbolAction } from "src/types/Symbols";
import { store } from "src/valtio";

export const handleSymbols = (data: SymbolAction): void => {
  const { type, payload } = data;

  if (type && payload && isSymbol(payload)) {
    switch (type) {
      case "CREATE": {
        store.symbols.toCreate.push(payload);
        break;
      }
      case "UPDATE": {
        const candidateIndex = store.symbols.toUpdate.findIndex(
          (s) => s.uid === payload.uid
        );

        if (candidateIndex === -1) {
          store.symbols.toUpdate.push(payload);
        }

        store.symbols.toUpdate[candidateIndex] = payload;
        break;
      }
      case "DELETE": {
        store.symbols.toDelete.push(payload);
        break;
      }
    }
  }
};

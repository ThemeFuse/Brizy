import { findSymbolIndex, isSymbol } from "src/symbols/utils";
import { SymbolAction } from "src/types/Symbols";
import { store } from "src/valtio";
import { State } from "src/valtio/types";
import { snapshot } from "valtio/vanilla";

export const handleSymbols = (data: SymbolAction): void => {
  const { type, payload } = data;

  if (type && payload && isSymbol(payload)) {
    const state = snapshot(store) as Readonly<State>;

    switch (type) {
      case "CREATE": {
        store.symbols.toCreate.push(payload);
        break;
      }
      case "UPDATE": {
        const indexInToCreate = findSymbolIndex("create", payload, state);

        if (indexInToCreate !== undefined) {
          if (state.symbols.toCreate[indexInToCreate]) {
            store.symbols.toCreate[indexInToCreate].data = payload.data;
            break;
          }
        }

        const candidateIndex = store.symbols.toUpdate.findIndex(
          (s) => s.uid === payload.uid
        );

        if (candidateIndex === -1) {
          store.symbols.toUpdate.push(payload);
          break;
        }

        store.symbols.toUpdate[candidateIndex] = payload;
        break;
      }
      case "DELETE": {
        const indexInCreate = findSymbolIndex("create", payload, state);

        if (indexInCreate !== undefined && indexInCreate !== -1) {
          store.symbols.toCreate.splice(indexInCreate, 1);
          break;
        }

        store.symbols.toDelete.push(payload);
        break;
      }
    }
  }
};

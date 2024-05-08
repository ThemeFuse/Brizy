import { store } from "@/store";
import { getIndex as getSymbolIndex } from "@/symbols/utils";
import { SymbolAction, SymbolsAction } from "@/types/Symbols";
import { remove } from "lodash";

export const handleSymbols = (action: SymbolsAction): void => {
  const { type } = action;

  switch (type) {
    case SymbolAction.Create: {
      store.symbols.toCreate.push(action.payload);
      break;
    }
    case SymbolAction.Update: {
      const { uid } = action.payload;
      const index = getSymbolIndex(uid, store.symbols.toCreate);

      if (index === -1) {
        store.symbols.toUpdate.push(action.payload);
      } else {
        store.symbols.toCreate.splice(index, 1, action.payload);
      }

      break;
    }
    case SymbolAction.DELETE: {
      const uid = action.payload;

      const indexInToCreate = getSymbolIndex(uid, store.symbols.toCreate);

      if (indexInToCreate !== -1) {
        remove(store.symbols.toCreate, { uid });
        break;
      }

      const indexInToUpdate = getSymbolIndex(uid, store.symbols.toUpdate);

      if (indexInToUpdate !== -1) {
        remove(store.symbols.toUpdate, { uid });
      }

      store.symbols.toDelete.push(uid);
      break;
    }
  }
};

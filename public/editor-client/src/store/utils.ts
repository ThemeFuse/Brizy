import { store } from "./index";
import { State } from "./types";

export const clearSymbols = (): void => {
  store.symbols.toCreate = [];
  store.symbols.toUpdate = [];
  store.symbols.toDelete = [];
};

export const hasSomeSymbolToUpdate = ({
  symbols: { toCreate, toUpdate, toDelete }
}: Readonly<State>): boolean =>
  toCreate.length > 0 || toUpdate.length > 0 || toDelete.length > 0;

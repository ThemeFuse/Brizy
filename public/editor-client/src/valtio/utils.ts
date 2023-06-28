import { State } from "./types";

export const clearSymbols = (store: State): void => {
  store.symbols.toCreate = [];
  store.symbols.toUpdate = [];
  store.symbols.toDelete = [];
};

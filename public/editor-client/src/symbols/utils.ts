import { ClassSymbol, SymbolRequestType } from "src/types/Symbols";
import * as Obj from "src/utils/reader/object";
import { MValue } from "src/utils/types";
import { State } from "src/valtio/types";

export const isSymbol = (s: unknown): s is ClassSymbol => {
  const symbol = s as ClassSymbol;

  return (
    !!symbol.uid &&
    !!symbol.label &&
    !!symbol.version &&
    !!symbol.data &&
    Obj.isObject(symbol.data)
  );
};

export const findSymbolIndex = (
  type: SymbolRequestType,
  symbol: ClassSymbol,
  state: Readonly<State>
): MValue<number> => {
  let arrayToSearch: ClassSymbol[] | undefined = undefined;

  switch (type) {
    case "create":
      arrayToSearch = state.symbols.toCreate;
      break;
    case "update":
      arrayToSearch = state.symbols.toUpdate;
      break;
    case "delete":
      arrayToSearch = state.symbols.toDelete;
      break;
  }

  if (arrayToSearch) {
    return arrayToSearch.findIndex((s) => s.uid === symbol.uid);
  }

  return undefined;
};

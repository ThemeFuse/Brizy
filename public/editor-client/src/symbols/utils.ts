import { ClassSymbol } from "src/types/Symbols";
import * as Obj from "src/utils/reader/object";

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

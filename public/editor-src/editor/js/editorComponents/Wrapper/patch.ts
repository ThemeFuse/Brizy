import { get } from "es-toolkit/compat";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { CSSSymbol } from "visual/types/Symbols";
import type { MValue } from "visual/utils/value";
import type { Meta } from "../ToolbarItemType";
import type { Value } from "./types";

export const isItemsWrapperPatch = (patch: Partial<Value>): boolean =>
  "items" in patch;

export const isSymbolsChildrenPatch = (meta?: Meta): boolean =>
  !!get(meta, ["patch", "classes"]);

export const symbolWrapperPatch = ({
  patch,
  symbols,
  v
}: {
  patch: Partial<Value>;
  symbols: CSSSymbol[];
  v: Value;
}): MValue<Partial<Value>> => {
  const childrenSymbolFromPatch = get(patch, [
    "items",
    "0",
    "value",
    "classes",
    "0"
  ]) as MValue<string>;

  if (childrenSymbolFromPatch) {
    const currentSymbolUid = symbols.find(
      (s) => s.uid === childrenSymbolFromPatch
    )?.uid;

    if (currentSymbolUid) {
      const wrapperSymbol = symbols.find(
        (s) =>
          // the wrapper check is not mandatory, but I leave it to make sure that the symbol is for the wrapper
          s.type === ElementTypes.Wrapper &&
          s.model.v.childrenId === currentSymbolUid
      );

      if (wrapperSymbol) {
        return {
          classes: [wrapperSymbol?.uid]
        };
      }
    } else {
      return {
        classes: []
      };
    }
  } else {
    const wrapperSymbol = v.classes?.[0];

    if (wrapperSymbol) {
      return {
        classes: []
      };
    }
  }
};

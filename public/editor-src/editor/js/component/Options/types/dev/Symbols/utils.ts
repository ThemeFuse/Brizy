import type { CSSSymbol } from "visual/types/Symbols";
import type { MValue } from "visual/utils/value";
import type { Choice } from "../EditableSelect/types";

export const NONE_CHOICE = {
  title: "None",
  value: "none",
  allowDuplicate: false,
  allowEdit: false,
  allowRemove: false
};

export const getSymbolsByType = (
  type: string,
  symbols: CSSSymbol[]
): CSSSymbol[] => symbols.filter((symbol) => symbol.type === type);

export const symbolsToChoices = (symbols: CSSSymbol[]): Choice[] => [
  ...symbols.map(({ uid, label }) => ({
    title: label,
    value: uid
  }))
];

export const getCurrentValue = (
  uid: string,
  choices: Choice[]
): MValue<Choice> => choices.find((choice) => choice.value === uid);

export const getSymbolByUid = (
  uid: string,
  symbols: CSSSymbol[]
): MValue<CSSSymbol> => symbols.find((symbol) => symbol.uid === uid);

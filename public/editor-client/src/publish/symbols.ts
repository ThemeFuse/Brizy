import { createSymbol, deleteSymbol, updateSymbol } from "@/api";
import { clearSymbols } from "@/store/utils";
import { CSSSymbol } from "@/types/Symbols";

export const updateSymbols = async (
  toCreate: CSSSymbol[],
  toUpdate: CSSSymbol[],
  toDelete: string[]
) => {
  if (toCreate.length > 0) {
    await createSymbol(toCreate);
  }

  if (toUpdate.length > 0) {
    await updateSymbol(toUpdate);
  }

  if (toDelete.length > 0) {
    await deleteSymbol(toDelete);
  }

  clearSymbols();
};

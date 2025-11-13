import { updateSymbols as apiUpdateSymbols } from "@/api";
import { symbolsState, SymbolState } from "@/state/symbols";
import { afterSymbolsUpdate, beforeSymbolsUpdate } from "@/utils/symbols";
import { snapshot } from "valtio";

export const updateSymbols = async () => {
  const symbols = snapshot(symbolsState) as SymbolState;

  const updateCandidates = symbols.current.filter((s) => s.type === "update");

  if (updateCandidates.length > 0) {
    const convertedUpdate = beforeSymbolsUpdate(symbols);

    const updateResults = await apiUpdateSymbols(convertedUpdate);

    afterSymbolsUpdate(symbolsState, updateResults);
  }
};

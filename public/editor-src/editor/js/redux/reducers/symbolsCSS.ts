import type { SymbolCSS } from "visual/types/Symbols";
import { ActionTypes, PUBLISH, type ReduxAction } from "../actions2";
import type { ReduxState } from "../types";

type SymbolsCSS = ReduxState["symbolsCSS"];
type RSymbolsCSS = (s: SymbolCSS, a: ReduxAction) => SymbolsCSS;

export const symbolsCSS: RSymbolsCSS = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDDATE_SYMBOLS_CSS: {
      return action.payload;
    }
    case PUBLISH:
      return {};
    default:
      return state;
  }
};

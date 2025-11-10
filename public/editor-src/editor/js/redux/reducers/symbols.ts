import { produce } from "immer";
import { HYDRATE } from "../actions";
import { ActionTypes, type ReduxAction } from "../actions2";
import type { ReduxState } from "../types";

type CSSClass = ReduxState["symbols"];
type RCSSClass = (s: CSSClass, a: ReduxAction) => CSSClass;

export const symbols: RCSSClass = (state, action) => {
  switch (action.type) {
    case HYDRATE: {
      const { symbols } = action.payload;

      return {
        element: undefined,
        classes: symbols ?? []
      };
    }
    case ActionTypes.CREATE_SYMBOL: {
      const { element, cssClasses } = action.payload;

      return produce<CSSClass>(state, (draft) => {
        draft.element = element;
        draft.classes.push(...cssClasses);
      });
    }
    case ActionTypes.UPDATE_SYMBOL: {
      const { element, cssClass: payloadClass } = action.payload;

      return produce<CSSClass>(state, (draft) => {
        draft.element = element;
        draft.classes = draft.classes.map((cssClass) => {
          return cssClass.uid === payloadClass.uid ? payloadClass : cssClass;
        });
      });
    }
    case ActionTypes.DELETE_SYMBOL: {
      const uids = action.payload.filter(Boolean);

      return produce<CSSClass>(state, (draft) => {
        draft.classes = draft.classes.filter(
          (cssClass) => !uids.includes(cssClass.uid)
        );
      });
    }
    default:
      return state;
  }
};

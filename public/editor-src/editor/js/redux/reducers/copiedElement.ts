import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";

type CopiedElement = ReduxState["copiedElement"];
type RCopiedElement = (s: CopiedElement, a: ReduxAction) => CopiedElement;

const copiedElementDefault: CopiedElement = {
  value: {
    items: []
  },
  path: []
};
export const copiedElement: RCopiedElement = (
  state = copiedElementDefault,
  action
) => {
  switch (action.type) {
    case ActionTypes.COPY_ELEMENT:
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
};

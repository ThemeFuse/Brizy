import { ReduxState } from "../types";
import { ReduxAction } from "../actions2";

type Authorized = ReduxState["authorized"];
type RAuthorized = (s: Authorized, a: ReduxAction) => Authorized;

export const authorized: RAuthorized = (state, action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { authorized } = action.payload;

      return authorized;
    }
    case "UPDATE_AUTHORIZATION": {
      return action.payload;
    }
    default:
      return state;
  }
};

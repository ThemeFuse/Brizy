import { ReduxState } from "visual/redux/types";
import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { HYDRATE } from "visual/redux/actions";

type ConfigId = ReduxState["configId"];
type RConfigId = (s: ConfigId, a: ReduxAction, f: ReduxState) => ConfigId;

export const configId: RConfigId = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_CONFIG_ID:
    case HYDRATE: {
      return action.payload.configId;
    }
    default: {
      return state;
    }
  }
};

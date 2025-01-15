import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { PROJECT_LOCKED_ERROR } from "visual/utils/errors";

type Error = ReduxState["error"];
type RError = (s: Error, a: ReduxAction, f: ReduxState) => Error;

const errorDefault = null;

export const error: RError = (state = errorDefault, action) => {
  switch (action.type) {
    case "HYDRATE": {
      const { projectStatus } = action.payload;

      if (!projectStatus) {
        return state;
      }

      if (projectStatus.locked) {
        return {
          code: PROJECT_LOCKED_ERROR,
          data: projectStatus
        };
      }

      return state;
    }
    case ActionTypes.UPDATE_ERROR: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

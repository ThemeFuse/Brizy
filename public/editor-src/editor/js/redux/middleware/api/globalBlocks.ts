import _ from "underscore";
import Config from "visual/global/Config";
import {
  globalBlocksAssembledSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { ActionTypes, ReduxAction } from "../../actions2";
import { apiAutoSave, apiOnChange } from "./utils";

interface Data {
  action: ReduxAction;
  state: ReduxState;
  apiHandler: (
    promise: Promise<unknown>,
    onSuccess: VoidFunction,
    onError: VoidFunction
  ) => void;
}

export function handleGlobalBlocks({ action, state }: Data): void {
  switch (action.type) {
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      const { _id } = action.payload.block.value;
      const config = Config.getAll();
      const globalBlock = globalBlocksSelector(state)[_id];

      apiAutoSave({ globalBlock }, config);
      break;
    }
    case ActionTypes.REMOVE_BLOCK: {
      const { id } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[id];
      const config = Config.getAll();

      if (globalBlock) {
        apiAutoSave({ globalBlock }, config);
      }
      break;
    }

    case "UPDATE_GLOBAL_BLOCK": {
      const { uid } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[uid];
      const config = Config.getAll();

      if (globalBlock) {
        apiAutoSave({ globalBlock }, config);
      }
      break;
    }
    case "UPDATE_GB_RULES": {
      const { id } = action.payload;
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const globalBlock = globalBlocksSelector(state)[id];
      const config = Config.getAll();

      apiOnChange({ globalBlock }, config).then(syncSuccess).catch(syncFail);
      break;
    }
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[fromBlockId];
      const config = Config.getAll();

      apiAutoSave({ globalBlock }, config);
      break;
    }
    case "DELETE_GLOBAL_BLOCK": {
      const { id } = action.payload;
      const globalBlock = globalBlocksSelector(state)[id];
      const config = Config.getAll();

      apiOnChange({ globalBlock }, config);
      break;
    }
  }
}

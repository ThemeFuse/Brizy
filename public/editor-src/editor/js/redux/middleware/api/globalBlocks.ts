import _ from "underscore";
import {
  globalBlocksAssembledSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { mPipe } from "visual/utils/fp";
import { readKey, read as readObj } from "visual/utils/reader/object";
import { ReduxAction } from "../../actions2";
import { apiUpdateGlobalBlock, debouncedApiUpdateGlobalBlock } from "./utils";

interface Data {
  action: ReduxAction;
  state: ReduxState;
  apiHandler: (
    promise: Promise<unknown>,
    onSuccess: VoidFunction,
    onError: VoidFunction
  ) => void;
}

const getMeta = mPipe(readKey("meta"), readObj);

export function handleGlobalBlocks({ action, state }: Data): void {
  switch (action.type) {
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      const { _id } = action.payload.block.value;

      const globalBlock = globalBlocksSelector(state)[_id];

      debouncedApiUpdateGlobalBlock.set(_id, _id, globalBlock, action.meta);
      break;
    }
    case "UPDATE_GLOBAL_BLOCK":
    case "REMOVE_BLOCK": {
      const { id } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[id];

      if (globalBlock) {
        debouncedApiUpdateGlobalBlock.set(id, id, globalBlock, getMeta(action));
      }
      break;
    }
    case "UPDATE_GB_RULES": {
      const { id } = action.payload;
      const { syncSuccess = _.noop, syncFail = _.noop } = action.meta || {};
      const globalBlock = globalBlocksSelector(state)[id];

      apiUpdateGlobalBlock(id, globalBlock, { is_autosave: 0 })
        .then(syncSuccess as (t: unknown) => unknown)
        .catch(syncFail);
      break;
    }
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[fromBlockId];

      debouncedApiUpdateGlobalBlock.set(
        fromBlockId,
        fromBlockId,
        globalBlock,
        getMeta(action)
      );
      break;
    }
    case "DELETE_GLOBAL_BLOCK": {
      const { id } = action.payload;
      const globalBlock = globalBlocksSelector(state)[id];

      debouncedApiUpdateGlobalBlock.set(id, id, globalBlock, {
        is_autosave: 0
      });
      break;
    }
  }
}

import { noop } from "es-toolkit";
import {
  globalBlocksAssembledSelector,
  globalBlocksSelector,
  pageSelector,
  projectSelector
} from "visual/redux/selectors";
import { PageCommon } from "visual/types/Page";
import { ActionTypes } from "../../actions2";
import { Data } from "./types";
import { apiAutoSave, apiOnChange } from "./utils";

export function handleGlobalBlocks({ action, state, config }: Data): void {
  switch (action.type) {
    case "ADD_GLOBAL_BLOCK":
    case "ADD_GLOBAL_POPUP": {
      const { _id } = action.payload.block.value;
      const globalBlock = globalBlocksSelector(state)[_id];

      apiAutoSave({ globalBlock }, config);
      break;
    }
    case ActionTypes.REMOVE_BLOCK: {
      const { id } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[id];

      if (globalBlock) {
        apiAutoSave({ globalBlock }, config);
      }
      break;
    }

    case "UPDATE_GLOBAL_BLOCK": {
      const { uid } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[uid];

      if (globalBlock) {
        apiAutoSave({ globalBlock }, config);
      }
      break;
    }
    case "UPDATE_GB_RULES": {
      const { id } = action.payload;
      const { syncSuccess = noop, syncFail = noop } = action.meta || {};
      const globalBlocks = globalBlocksSelector(state);
      const globalBlock = globalBlocks[id];
      // @ts-expect-error Type Page is not assignable to type PageCommon
      const page: PageCommon = pageSelector(state);
      const project = projectSelector(state);
      const data = {
        config,
        needToCompile: {
          globalBlocks: [globalBlock]
        },
        state: {
          project,
          page,
          globalBlocks: Object.values(globalBlocks)
        }
      };

      apiOnChange(data).then(syncSuccess).catch(syncFail);
      break;
    }
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[fromBlockId];

      apiAutoSave({ globalBlock }, config);
      break;
    }
    case "DELETE_GLOBAL_BLOCK": {
      const { id } = action.payload;
      const globalBlocks = globalBlocksSelector(state);
      const globalBlock = globalBlocks[id];
      // @ts-expect-error Type Page is not assignable to type PageCommon
      const page: PageCommon = pageSelector(state);
      const project = projectSelector(state);
      const data = {
        config,
        needToCompile: {
          globalBlocks: [globalBlock]
        },
        state: {
          project,
          page,
          globalBlocks: Object.values(globalBlocks)
        }
      };

      apiOnChange(data);
      break;
    }
  }
}

import _ from "underscore";
import Config from "visual/global/Config";
import {
  globalBlocksAssembledSelector,
  globalBlocksSelector,
  pageSelector,
  projectSelector
} from "visual/redux/selectors";

import { ActionTypes } from "../../actions2";
import { apiAutoSave, apiOnChange } from "./utils";
import { PageCommon } from "visual/types";
import { Data } from "./types";

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
      const globalBlocks = globalBlocksSelector(state);
      const globalBlock = globalBlocks[id];
      // @ts-expect-error Type Page is not assignable to type PageCommon
      const page: PageCommon = pageSelector(state);
      const project = projectSelector(state);
      const config = Config.getAll();
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
      const config = Config.getAll();

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
      const config = Config.getAll();
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

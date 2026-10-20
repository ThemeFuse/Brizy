import { noop } from "es-toolkit";
import {
  globalBlocksAssembledSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { updateGBRules as updateGBRulesAPI } from "visual/utils/api";
import { ActionTypes } from "../../actions2";
import type { Data } from "./types";
import { apiAutoSave } from "./utils";

export function handleGlobalBlocks({ action, state, getConfig }: Data): void {
  const config = getConfig();

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

    case "UPDATE_GLOBAL_BLOCK":
    case ActionTypes.UPDATE_GLOBAL_BLOCK_METADATA: {
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
      const globalBlock = globalBlocksSelector(state)[id];

      if (!globalBlock) {
        syncFail({ message: undefined });
        break;
      }

      // Rules don't affect the block's compiled HTML, so save only the rules
      // via the dedicated updateRules handler instead of recompiling the block.
      // The payload is therefore only { uid, rules, dataVersion }; changes to the
      // block's content and metadata are still persisted by apiAutoSave on
      // UPDATE_GLOBAL_BLOCK.
      updateGBRulesAPI(
        globalBlock.uid,
        globalBlock.rules,
        globalBlock.dataVersion,
        config
      ).then(
        () => syncSuccess(),
        (e: unknown) =>
          syncFail({ message: e instanceof Error ? e.message : String(e) })
      );
      break;
    }
    case "MAKE_GLOBAL_BLOCK_TO_BLOCK": {
      const { fromBlockId } = action.payload;
      const globalBlock = globalBlocksAssembledSelector(state)[fromBlockId];

      apiAutoSave({ globalBlock }, config);
      break;
    }
  }
}

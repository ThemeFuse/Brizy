import { ActionTypes } from "visual/redux/actions2";
import {
  blocksOrderSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { UPDATE_GB_RULES } from "../actions";
import { historyReducerEnhancer } from "../history/reducers";
import { authorized } from "./authorized";
import { blocksData } from "./blocksData";
import { blocksOrder } from "./blocksOrder";
import { changedGBIds } from "./changedGBIds";
import { copiedElement } from "./copiedElement";
import { currentStyle } from "./currentStyle";
import { currentStyleId } from "./currentStyleId";
import { error } from "./error";
import { extraFontStyles } from "./extraFontStyles";
import { extraStyles } from "./extraStyles";
import { fonts } from "./fonts";
import { globalBlocks } from "./globalBlocks";
import { page } from "./page";
import { project } from "./project";
import { screenshots } from "./screenshots";
import { storeWasChanged } from "./storeWasChanged";
import { styles } from "./styles";
import { syncAllowed } from "./syncAllowed";
import { ui } from "./ui";
import { configId } from "./config";

export default historyReducerEnhancer(
  combineReducersCustom(
    {
      authorized,
      syncAllowed,
      blocksData,
      copiedElement,
      error,
      extraFontStyles,
      fonts,
      globalBlocks,
      changedGBIds,
      page,
      blocksOrder,
      project,
      styles,
      currentStyleId,
      currentStyle,
      ui,
      storeWasChanged,
      extraStyles,
      configId
    },
    {
      screenshots
    }
  ),
  {
    keysToTrack: [
      "blocksOrder",
      "blocksData",
      "currentStyleId",
      "currentStyle",
      "extraFontStyles",
      "storeWasChanged",
      "extraStyles"
    ],
    onBeforeUpdate: (state, action, history) => {
      if (
        action.type === UPDATE_GB_RULES ||
        action.type === ActionTypes.REMOVE_BLOCK ||
        action.type === ActionTypes.REMOVE_BLOCKS
      ) {
        // const { id } = action.payload;
        const blocksOrder = blocksOrderSelector(state);
        const globalBlocks = globalBlocksSelector(state);
        const ids =
          action.type === ActionTypes.REMOVE_BLOCKS
            ? blocksOrder
            : [action.payload.id];

        ids.forEach((id) => {
          if (blocksOrder.includes(id) && globalBlocks[id]) {
            const snapshots = history.getSnapshots();

            history.replaceSnapshots(
              snapshots.map((snapshot) => {
                if (snapshot?.blocksOrder) {
                  snapshot.blocksOrder = snapshot.blocksOrder.filter(
                    (_id) => _id !== id
                  );
                }

                return snapshot;
              })
            );
          }
        });
      }
    }
  }
);

function combineReducersCustom(slices, slicesAfter) {
  return (state = {}, action) => {
    const ret = {};

    Object.entries(slices).reduce((acc, [key, sliceReducer]) => {
      acc[key] = sliceReducer(state[key], action, state);

      return acc;
    }, ret);

    Object.entries(slicesAfter).reduce((acc, [key, sliceReducer]) => {
      acc[key] = sliceReducer(state[key], action, state, acc);

      return acc;
    }, ret);

    return ret;
  };
}

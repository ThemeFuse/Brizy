import produce from "immer";
import {
  blocksOrderSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { objectTraverse2 } from "visual/utils/object";
import { PROJECT_LOCKED_ERROR } from "visual/utils/errors";
import { historyReducerEnhancer } from "../history/reducers";

import { project } from "./project";
import { page } from "./page";
import { blocksOrder } from "./blocksOrder";
import { blocksData } from "./blocksData";
import { globalBlocks } from "./globalBlocks";
import { changedGBIds } from "./changedGBIds";
import {
  HYDRATE,
  UPDATE_GB_RULES,
  COPY_ELEMENT,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  UPDATE_SCREENSHOT,
  UPDATE_ERROR,
  MAKE_NORMAL_TO_GLOBAL_BLOCK,
  REMOVE_BLOCK,
  REMOVE_BLOCKS
} from "../actions";
import {
  PUBLISH,
  IMPORT_STORY,
  IMPORT_KIT,
  IMPORT_TEMPLATE
} from "../actions2";
import { extraFontStyles } from "./extraFontStyles";
import { ui } from "./ui";
import { syncAllowed } from "./syncAllowed";
import { authorized } from "./authorized";
import { fonts } from "./fonts";
import { storeWasChanged } from "./storeWasChanged";

// styles

export function styles(state = [], action) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.styles;
    }
    case IMPORT_STORY:
    case IMPORT_TEMPLATE:
    case IMPORT_KIT: {
      const { styles } = action.payload;

      if (!styles) {
        return state;
      }

      return [...state, ...styles];
    }
    default:
      return state;
  }
}

export function currentStyleId(state = "", action) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.selectedStyle;
    }
    case UPDATE_CURRENT_STYLE_ID: {
      return action.payload;
    }
    case IMPORT_STORY:
    case IMPORT_TEMPLATE: {
      const { currentStyleId } = action.payload;

      return currentStyleId || state;
    }
    default:
      return state;
  }
}

export function currentStyle(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.styles.find(
        (style) => style.id === project.data.selectedStyle
      );
    }
    case UPDATE_CURRENT_STYLE: {
      return action.payload;
    }
    case UPDATE_CURRENT_STYLE_ID: {
      const currentStyleId = action.payload;

      return fullState.styles.find(({ id }) => id === currentStyleId);
    }
    case IMPORT_STORY:
    case IMPORT_TEMPLATE: {
      const { currentStyleId, styles } = action.payload;
      const allStyles = [...(styles ?? []), ...fullState.styles];

      return currentStyleId
        ? allStyles.find((style) => style.id === currentStyleId)
        : state;
    }
    default:
      return state;
  }
}

// copy

const copiedElementDefault = {
  value: {},
  path: []
};
export function copiedElement(state = copiedElementDefault, action) {
  switch (action.type) {
    case COPY_ELEMENT:
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
}

// screenshots

const validateScreenshots = (obj) =>
  obj.type && obj.value && obj.value._id && obj.value._thumbnailSrc;

function parseScreenshots(data) {
  const acc = {};

  objectTraverse2(data, (obj) => {
    if (validateScreenshots(obj)) {
      const v = obj.value;

      acc[obj.value._id] = {
        _thumbnailSrc: v._thumbnailSrc,
        _thumbnailWidth: v._thumbnailWidth,
        _thumbnailHeight: v._thumbnailHeight,
        _thumbnailTime: v._thumbnailTime
      };
    }
  });

  return acc;
}
export function screenshots(
  state = {},
  action,
  fullState,
  inConstructionState
) {
  switch (action.type) {
    case HYDRATE:
    case PUBLISH: {
      const pageScreenshots = parseScreenshots(inConstructionState.page.data);
      const globalBlocksScreenshots = {};

      // global blocks parsing is a little more messy
      for (const [key, obj] of Object.entries(
        inConstructionState.globalBlocks
      )) {
        const objValue = obj.data;
        if (validateScreenshots(objValue)) {
          const v = objValue.value;

          globalBlocksScreenshots[key] = {
            _thumbnailSrc: v._thumbnailSrc,
            _thumbnailWidth: v._thumbnailWidth,
            _thumbnailHeight: v._thumbnailHeight,
            _thumbnailTime: v._thumbnailTime
          };
        }

        Object.assign(
          globalBlocksScreenshots,
          parseScreenshots(objValue.value)
        );
      }

      return {
        ...pageScreenshots,
        ...globalBlocksScreenshots,
        _published: {
          ...pageScreenshots,
          ...globalBlocksScreenshots
        }
      };
    }
    case UPDATE_SCREENSHOT: {
      const {
        payload: { blockId, data }
      } = action;

      return produce(state, (draft) => {
        draft[blockId] = data;
      });
    }
    case MAKE_NORMAL_TO_GLOBAL_BLOCK: {
      const {
        data: {
          value: { _id }
        },
        meta
      } = action.payload;
      const screenshot = {
        _thumbnailSrc: meta._thumbnailSrc,
        _thumbnailWidth: meta._thumbnailWidth,
        _thumbnailHeight: meta._thumbnailHeight,
        _thumbnailTime: meta._thumbnailTime
      };

      return produce(state, (draft) => {
        draft[_id] = screenshot;
        draft._published[_id] = screenshot;
      });
    }
    default:
      return state;
  }
}

// error

const errorDefault = null;
export function error(state = errorDefault, action) {
  switch (action.type) {
    case HYDRATE: {
      const { projectStatus } = action.payload;

      if (projectStatus.locked) {
        return {
          code: PROJECT_LOCKED_ERROR,
          data: projectStatus
        };
      }

      return state;
    }
    case UPDATE_ERROR: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

export default historyReducerEnhancer(
  combineReducersCustom(
    {
      authorized,
      syncAllowed,
      blocksData,
      copiedElement,
      currentStyle,
      currentStyleId,
      error,
      extraFontStyles,
      fonts,
      globalBlocks,
      changedGBIds,
      page,
      blocksOrder,
      project,
      styles,
      ui,
      storeWasChanged
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
      "globalBlocksUpdates",
      "storeWasChanged"
    ],
    onBeforeUpdate: (state, action, history) => {
      if (
        action.type === UPDATE_GB_RULES ||
        action.type === REMOVE_BLOCK ||
        action.type === REMOVE_BLOCKS
      ) {
        // const { id } = action.payload;
        const blocksOrder = blocksOrderSelector(state);
        const globalBlocks = globalBlocksSelector(state);
        const ids =
          action.type === REMOVE_BLOCKS ? blocksOrder : [action.payload.id];

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

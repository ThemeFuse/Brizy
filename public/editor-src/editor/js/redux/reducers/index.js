import produce from "immer";
import { removeAt, insert } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  projectAssembled,
  pageAssembledSelector,
  globalBlocksAssembledSelector,
  globalBlocksAssembled2Selector
} from "visual/redux/selectors";
import { mapModels } from "visual/utils/models";
import { objectTraverse2 } from "visual/utils/object";
import { PROJECT_LOCKED_ERROR } from "visual/utils/errors";
import historyEnhancer from "./historyEnhancer";
import {
  HYDRATE,
  UPDATE_RULES,
  UPDATE_BLOCKS,
  REORDER_BLOCKS,
  REMOVE_BLOCK,
  CREATE_GLOBAL_BLOCK,
  UPDATE_GLOBAL_BLOCK,
  DELETE_GLOBAL_BLOCK,
  CREATE_SAVED_BLOCK,
  UPDATE_SAVED_BLOCK,
  DELETE_SAVED_BLOCK,
  UPDATE_UI,
  COPY_ELEMENT,
  IMPORT_TEMPLATE,
  IMPORT_KIT,
  ADD_BLOCK,
  UPDATE_CURRENT_KIT_ID,
  UPDATE_CURRENT_STYLE_ID,
  UPDATE_CURRENT_STYLE,
  UPDATE_EXTRA_FONT_STYLES,
  ADD_FONTS,
  DELETE_FONTS,
  PUBLISH,
  UPDATE_SCREENSHOT,
  UPDATE_DISABLED_ELEMENTS,
  UPDATE_TRIGGERS,
  UPDATE_ERROR
} from "../actions";

// project

export function project(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project;
    }
    case PUBLISH: {
      return produce(projectAssembled(fullState), draft => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case UPDATE_DISABLED_ELEMENTS: {
      const disabledElements = action.payload;

      return produce(state, draft => {
        draft.data.disabledElements = disabledElements;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case IMPORT_KIT: {
      const { selectedKit } = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case UPDATE_CURRENT_KIT_ID: {
      const selectedKit = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case IMPORT_TEMPLATE:
    case ADD_FONTS:
    case DELETE_FONTS: {
      return produce(state, draft => {
        draft.dataVersion = draft.dataVersion + 1;
      });
    }

    default:
      return state;
  }
}

// fonts

export function fonts(state = {}, action) {
  switch (action.type) {
    case HYDRATE: {
      const { fonts } = action.payload;

      return fonts;
    }
    case ADD_FONTS:
    case DELETE_FONTS: {
      const fonts = action.payload;

      return { ...state, ...fonts };
    }
    case IMPORT_TEMPLATE:
    case IMPORT_KIT:
    case ADD_BLOCK: {
      const { fonts } = action.payload;

      if (!fonts || fonts.length === 0) {
        return state;
      }

      return produce(state, draft => {
        fonts.forEach(({ type, fonts }) => {
          draft[type] = draft[type] || { data: [] };

          draft[type].data.push(...fonts);
        });
      });
    }
    default:
      return state;
  }
}

// styles

export function styles(state = [], action) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.styles;
    }
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
        style => style.id === project.data.selectedStyle
      );
    }
    case UPDATE_CURRENT_STYLE: {
      return action.payload;
    }
    case UPDATE_CURRENT_STYLE_ID: {
      const currentStyleId = action.payload;

      return fullState.styles.find(({ id }) => id === currentStyleId);
    }
    case IMPORT_TEMPLATE: {
      const { currentStyleId, styles } = action.payload;

      return currentStyleId
        ? styles.find(style => style.id === currentStyleId)
        : state;
    }
    default:
      return state;
  }
}

export function extraFontStyles(state = [], action) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project.data.extraFontStyles;
    }
    case UPDATE_EXTRA_FONT_STYLES: {
      return action.payload;
    }
    default:
      return state;
  }
}

// page

export function page(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      const { page } = action.payload;

      return page;
    }
    case PUBLISH: {
      return produce(pageAssembledSelector(fullState), draft => {
        draft.status = "publish";
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case UPDATE_TRIGGERS: {
      const { data: triggers } = action.payload;

      return produce(state, draft => {
        draft.data.triggers = triggers;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    case UPDATE_RULES: {
      return produce(state, draft => {
        draft.data.rulesAmount = action.payload.length;
        draft.dataVersion = draft.dataVersion + 1;
      });
    }
    default:
      return state;
  }
}

export function pageBlocks(state = [], action) {
  switch (action.type) {
    case HYDRATE: {
      const { page } = action.payload;

      return page.data.items || [];
    }
    case ADD_BLOCK: {
      const { block } = action.payload;
      const { insertIndex } = action.meta;
      const newPageBlocks = EditorArrayComponent.insertItemsBatch(
        state,
        insertIndex,
        [block]
      );

      return newPageBlocks;
    }
    case REMOVE_BLOCK: {
      const { index } = action.payload;
      const newBlocks = removeAt(state, index);

      return newBlocks;
    }
    case REORDER_BLOCKS: {
      const { oldIndex, newIndex } = action.payload;
      const movedBlock = state[oldIndex];
      const newBlocks = insert(removeAt(state, oldIndex), newIndex, movedBlock);

      return newBlocks;
    }
    case UPDATE_BLOCKS: {
      const { blocks } = action.payload;

      return blocks;
    }
    case IMPORT_TEMPLATE: {
      const { blocks: templateBlocks } = action.payload;
      const { insertIndex } = action.meta;
      const newPageBlocks = EditorArrayComponent.insertItemsBatch(
        state,
        insertIndex,
        templateBlocks
      );

      return newPageBlocks;
    }
    default:
      return state;
  }
}

export function blocksThumbnailSizes(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      return action.payload.blocksThumbnailSizes;
    default:
      return state;
  }
}

// global blocks

export function globalBlocks(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.globalBlocks;
    }
    case CREATE_GLOBAL_BLOCK: {
      const { id, data } = action.payload;

      return produce(state, draft => {
        draft[id] = { id, data, dataVersion: 1 };
      });
    }
    case DELETE_GLOBAL_BLOCK: {
      const { id } = action.payload;

      return produce(state, draft => {
        draft[id].data.deleted = true;
        draft[id].dataVersion = draft[id].dataVersion + 1;
      });
    }
    case PUBLISH: {
      const blocks = globalBlocksAssembledSelector(fullState);

      return Object.entries(blocks).reduce((acc, [key, block]) => {
        acc[key] = produce(block, draft => {
          draft.dataVersion = draft.dataVersion + 1;
        });

        return acc;
      }, {});
    }
    case UPDATE_SCREENSHOT: {
      const {
        payload: { blockId, data: screenshots },
        meta: { blockType, action: metaAction }
      } = action;

      if (blockType === "global" && metaAction === "create") {
        return produce(state, draft => {
          Object.assign(draft[blockId].data.value, screenshots);
          draft[blockId].dataVersion = draft[blockId].dataVersion + 1;
        });
      }

      return state;
    }
    default:
      return state;
  }
}

export function globalBlocksUpdates(state = {}, action) {
  switch (action.type) {
    case UPDATE_GLOBAL_BLOCK: {
      const {
        id,
        data: { value }
      } = action.payload;

      return { ...state, [id]: value };
    }
    default:
      return state;
  }
}

// saved blocks

export function savedBlocks(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.savedBlocks;
    }
    case CREATE_SAVED_BLOCK: {
      const { id, data } = action.payload;
      const globalBlock = globalBlocksAssembled2Selector(fullState);
      const blockData = mapModels(model => {
        if (model.type === "GlobalBlock") {
          const { globalBlockId } = model.value;
          return globalBlock[globalBlockId]?.data;
        }

        return model;
      }, data);

      return produce(state, draft => {
        draft[id] = { id, data: blockData, dataVersion: 1 };
      });
    }
    case UPDATE_SAVED_BLOCK: {
      const { id, data } = action.payload;

      return produce(state, draft => {
        draft[id].data = data;
        draft[id].dataVersion = draft[id].dataVersion + 1;
      });
    }
    case DELETE_SAVED_BLOCK: {
      const { id } = action.payload;

      return produce(state, draft => {
        delete draft[id];
      });
    }
    case UPDATE_SCREENSHOT: {
      const {
        payload: { blockId, data: screenshots },
        meta: { blockType }
      } = action;

      if (blockType === "saved") {
        return produce(state, draft => {
          Object.assign(draft[blockId].data.value, screenshots);
          draft[blockId].dataVersion = draft[blockId].dataVersion + 1;
        });
      }

      return state;
    }
    default:
      return state;
  }
}

// ui

const uiDefault = {
  deviceMode: "desktop",
  leftSidebar: {
    isOpen: false,
    drawerContentType: null
  },
  rightSidebar: {
    isOpen: false,
    lock: undefined, // undefined | "manual" | "auto"
    alignment: "right" // "left" | "right"
  },
  showHiddenElements: false,
  error: null
};
export function ui(state = uiDefault, action) {
  switch (action.type) {
    case UPDATE_UI: {
      const { key, value } = action;
      const newState = {
        ...state,
        [key]: value
      };

      // deviceMode + rightSidebar
      if (key === "deviceMode" && newState.rightSidebar.lock !== "manual") {
        if (value !== "desktop") {
          newState.rightSidebar = {
            ...newState.rightSidebar,
            isOpen: true,
            lock: "auto"
          };
        } else {
          if (newState.rightSidebar.isOpen) {
            newState.rightSidebar = {
              ...newState.rightSidebar,
              isOpen: false,
              lock: undefined
            };
          }
        }
      }

      return newState;
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

function parseScreenshots(data) {
  const acc = {};

  objectTraverse2(data, obj => {
    if (obj.type && obj.value && obj.value._id && obj.value._thumbnailSrc) {
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
        if (
          objValue.type &&
          objValue.value &&
          objValue.value._id &&
          objValue.value._thumbnailSrc
        ) {
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
        payload: { blockId, data },
        meta: { blockType, action: metaAction }
      } = action;

      const ret = {
        ...state,
        [blockId]: data
      };

      if (blockType === "global" && metaAction === "create") {
        ret._published = {
          ...ret._published,
          [blockId]: data
        };
      }

      return ret;
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

export default historyEnhancer(
  combineReducersCustom(
    {
      project,
      page,
      blocksThumbnailSizes,
      globalBlocks,
      globalBlocksUpdates,
      savedBlocks,
      styles,
      currentStyleId,
      currentStyle,
      extraFontStyles,
      pageBlocks,
      fonts,
      ui,
      copiedElement,
      error
    },
    {
      screenshots
    }
  ),
  {
    keysToTrack: [
      "pageBlocks",
      "currentStyleId",
      "currentStyle",
      "extraFontStyles",
      "globalBlocksUpdates"
    ]
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

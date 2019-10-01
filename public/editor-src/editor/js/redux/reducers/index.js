import produce from "immer";
import { removeAt, insert } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  projectAssembled,
  pageAssembledSelector,
  globalBlocksAssembledSelector
} from "visual/redux/selectors";
import { objectTraverse2 } from "visual/utils/object";
import historyEnhancer from "./historyEnhancer";
import {
  HYDRATE,
  UPDATE_PAGE,
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
  SHOW_HIDDEN_ELEMENTS
} from "../actions";

// project

export function project(state = {}, action, fullState) {
  switch (action.type) {
    case HYDRATE: {
      const { project } = action.payload;

      return project;
    }
    case PUBLISH: {
      return projectAssembled(fullState);
    }
    case UPDATE_DISABLED_ELEMENTS: {
      const disabledElements = action.payload;

      return produce(state, draft => {
        draft.data.disabledElements = disabledElements;
      });
    }
    case IMPORT_KIT: {
      const { selectedKit } = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
      });
    }
    case UPDATE_CURRENT_KIT_ID: {
      const selectedKit = action.payload;

      return produce(state, draft => {
        draft.data.selectedKit = selectedKit;
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
    case ADD_BLOCK: {
      const {
        data: { items: pageBlocks = [] }
      } = state;
      const { block } = action.payload;
      const { insertIndex } = action.meta;
      const newPageBlocks = EditorArrayComponent.insertItemsBatch(
        pageBlocks,
        insertIndex,
        [block]
      );

      return produce(state, draft => {
        draft.data.items = newPageBlocks;
      });
    }
    case REMOVE_BLOCK: {
      const { index } = action.payload;
      const blocks = state.data.items || [];
      const newBlocks = removeAt(blocks, index);

      return {
        ...state,
        data: {
          ...state.data,
          items: newBlocks
        }
      };
    }
    case REORDER_BLOCKS: {
      const { oldIndex, newIndex } = action.payload;
      const blocks = state.data.items || [];
      const movedBlock = blocks[oldIndex];
      const newBlocks = insert(
        removeAt(blocks, oldIndex),
        newIndex,
        movedBlock
      );

      return {
        ...state,
        data: {
          ...state.data,
          items: newBlocks
        }
      };
    }
    case UPDATE_PAGE: {
      const { data, status = state.status } = action.payload;

      return {
        ...state,
        data,
        status
      };
    }
    case IMPORT_TEMPLATE: {
      const {
        data: { items: pageBlocks = [] }
      } = state;
      const { blocks: templateBlocks } = action.payload;
      const { insertIndex } = action.meta;
      const newPageBlocks = EditorArrayComponent.insertItemsBatch(
        pageBlocks,
        insertIndex,
        templateBlocks
      );

      return produce(state, draft => {
        draft.data.items = newPageBlocks;
      });
    }
    case PUBLISH: {
      return produce(pageAssembledSelector(fullState), draft => {
        draft.status = "publish";
      });
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

      return { ...state, [id]: data };
    }
    case DELETE_GLOBAL_BLOCK: {
      const { id } = action.payload;

      return {
        ...state,
        [id]: {
          ...state[id],
          deleted: true
        }
      };
    }
    case PUBLISH: {
      return globalBlocksAssembledSelector(fullState);
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

export function savedBlocks(state = {}, action) {
  switch (action.type) {
    case HYDRATE:
      return action.payload.savedBlocks;
    case CREATE_SAVED_BLOCK:
    case UPDATE_SAVED_BLOCK: {
      const { id, data } = action.payload;

      return { ...state, [id]: data };
    }
    case DELETE_SAVED_BLOCK: {
      const { id } = action.payload;
      const { [id]: deleted, ...remaining } = state;

      return remaining;
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
  }
};
export function ui(state = uiDefault, action) {
  switch (action.type) {
    case UPDATE_UI:
      return {
        ...state,
        [action.key]: action.value
      };
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

export function showHiddenElements(state = false, action) {
  switch (action.type) {
    case SHOW_HIDDEN_ELEMENTS:
      return action.value;
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
        if (obj.type && obj.value && obj.value._id && obj.value._thumbnailSrc) {
          const v = obj.value;

          globalBlocksScreenshots[key] = {
            _thumbnailSrc: v._thumbnailSrc,
            _thumbnailWidth: v._thumbnailWidth,
            _thumbnailHeight: v._thumbnailHeight,
            _thumbnailTime: v._thumbnailTime
          };
        }

        Object.assign(globalBlocksScreenshots, parseScreenshots(obj.value));
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
      fonts,
      ui,
      copiedElement,
      showHiddenElements
    },
    {
      screenshots
    }
  ),
  {
    keysToTrack: [
      "page",
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

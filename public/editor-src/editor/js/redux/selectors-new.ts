import { produce } from "immer";
import { createSelector } from "reselect";
import { getIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { getConfigById } from "visual/global/Config/InitConfig";
import { isShopifyPage } from "visual/global/Config/types/configs/Cloud";
import { FontKeyTypes } from "visual/redux/actions2";
import { ReduxState, StoreChanged } from "visual/redux/types";
import {
  Authorized,
  Block,
  Font,
  GlobalBlock,
  GlobalBlockPopup,
  SyncAllowed
} from "visual/types";
import { NonEmptyArray } from "visual/utils/array/types";
import { canUseCondition, createGlobalBlockSymbol } from "visual/utils/blocks";
import { getSurroundedGBIds } from "visual/utils/blocks/blocksConditions";
import { getModelPopups } from "visual/utils/blocks/getModelPopups";
import { getGroupFontsById } from "visual/utils/fonts";
import { mapModels } from "visual/utils/models";
import { objectFromEntries, objectTraverse2 } from "visual/utils/object";
import { MValue } from "visual/utils/value";

//#region === 0 DEPENDENCIES ===

export const stateSelector = (state: ReduxState): ReduxState => state;

export const projectSelector = (state: ReduxState): ReduxState["project"] =>
  state.project;

export const pageSelector = (state: ReduxState): ReduxState["page"] =>
  state.page;

export const blocksOrderSelector = (
  state: ReduxState
): ReduxState["blocksOrder"] => state.blocksOrder || [];

export const blocksDataSelector = (
  state: ReduxState
): ReduxState["blocksData"] => state.blocksData || {};

export const globalBlocksSelector = (
  state: ReduxState
): ReduxState["globalBlocks"] => state.globalBlocks || {};

export const authorizedSelector = (state: ReduxState): Authorized =>
  state.authorized;

export const syncAllowedSelector = (state: ReduxState): SyncAllowed =>
  state.syncAllowed;

export const fontsSelector = (state: ReduxState): ReduxState["fonts"] =>
  state.fonts;

export const extraStylesSelector = (
  state: ReduxState
): ReduxState["extraStyles"] => state.extraStyles || [];

export const extraFontStylesSelector = (
  state: ReduxState
): ReduxState["extraFontStyles"] => state.extraFontStyles;

export const uiSelector = (state: ReduxState): ReduxState["ui"] => state.ui;

export const storeWasChangedSelector = (
  state: ReduxState
): ReduxState["storeWasChanged"] =>
  state.storeWasChanged || StoreChanged.unchanged;

export const screenshotsSelector = (
  state: ReduxState
): ReduxState["screenshots"] => state.screenshots || {};

export const changedGBIdsSelector = (
  state: ReduxState
): ReduxState["changedGBIds"] => state.changedGBIds || {};

export const stylesSelector = (state: ReduxState): ReduxState["styles"] =>
  state.styles || [];

export const copiedElementSelector = (
  state: ReduxState
): ReduxState["copiedElement"] => state.copiedElement;

export const currentStyleIdSelector = (
  state: ReduxState
): ReduxState["currentStyleId"] => state.currentStyleId;

export const currentStyleSelector = (
  state: ReduxState
): ReduxState["currentStyle"] => state.currentStyle;

export const errorSelector = (state: ReduxState): ReduxState["error"] =>
  state.error;

export const configIdSelector = (state: ReduxState): ReduxState["configId"] =>
  state.configId;

//#endregion

//#region === 1 DEPENDENCIES ===
export const configSelector = createSelector(configIdSelector, getConfigById);

export const pageDataSelector = createSelector(
  pageSelector,
  (page) => page.data || {}
);

export const disabledElementsSelector = createSelector(
  projectSelector,
  (project) => project.data.disabledElements || []
);

export const pinnedElementsSelector = createSelector(
  projectSelector,
  (project) => project.data.pinnedElements || []
);

const deletedPredicate = <T extends { deleted?: boolean }>(t: T): boolean =>
  t.deleted !== true;

export const triggersSelector = createSelector(
  pageDataSelector,
  (pageData) => pageData.triggers || []
);

export const rulesAmountSelector = createSelector(
  pageDataSelector,
  (pageData) =>
    Number.isInteger(pageData.rulesAmount) ? pageData.rulesAmount : null
);

export const deviceModeSelector = createSelector(
  uiSelector,
  (ui) => ui.deviceMode
);

export const showHiddenElementsSelector = createSelector(
  uiSelector,
  (ui) => ui.showHiddenElements
);

export const unDeletedFontsSelector = createSelector(
  fontsSelector,
  (fonts): ReduxState["fonts"] => {
    return Object.entries(fonts).reduce((acc, curr) => {
      const [type, { data = [] } = { data: [] }] = curr;

      return {
        ...acc,
        [`${type}`]: {
          data: data.filter(deletedPredicate)
        }
      };
    }, {});
  }
);

export const filteredFontsSelector = createSelector(
  fontsSelector,
  (fonts): ReduxState["fonts"] => {
    return Object.entries(fonts).reduce((acc, curr) => {
      const [type, { id, data = [] } = { id: "", data: [] }] = curr;

      return {
        ...acc,
        [type]: {
          ...(type === "adobe" ? { id, data } : { data })
        }
      };
    }, {});
  }
);

export const defaultFontSelector = createSelector(
  projectSelector,
  (project) => project.data.font
);

export const currentRoleSelector = createSelector(
  uiSelector,
  (ui) => ui.currentRole
);

export const currentLanguageSelector = createSelector(
  uiSelector,
  (ui) => ui.currentLanguage
);

export const leftSidebarSelector = createSelector(
  uiSelector,
  (ui) => ui.leftSidebar
);

export const pageLayout = createSelector(
  pageSelector,
  configSelector,
  (page, config) => {
    if (isShopifyPage(page, config)) {
      return page.layout;
    }

    return undefined;
  }
);

//#endregion

//#region === 2 DEPENDENCIES ===

// Retrieve the IDs of all normal blocks, including globalBlocks between normal blocks,
// excluding the top and bottom globalBlocks.
export const blocksOrderRawSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  (blocksOrder, globalBlocks) => {
    const { top, bottom } = getSurroundedGBIds(blocksOrder, globalBlocks);

    return blocksOrder.filter(
      (id) => !top.includes(id) && !bottom.includes(id)
    );
  }
);

// Retrieve the IDs of globalBlocks between normal blocks,
// excluding the top and bottom globalBlocks.
export const middleGlobalBlocksIdSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  (blocksOrder, globalBlocks) => {
    const { top, bottom } = getSurroundedGBIds(blocksOrder, globalBlocks);
    const betweenGBIds = [...top, ...bottom];
    const orders = blocksOrder.filter((id) => !betweenGBIds.includes(id));
    return orders.filter((id) => globalBlocks[id]);
  }
);

// published globalBlocks + their updates
// this is used when rendering globalBlocks refs in the page
// and purposefully omits screenshots, to prevent a re-render when screenshots change
export const globalBlocksAssembled2Selector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  (globalBlocks, blocksData): Record<string, GlobalBlock> => {
    return objectFromEntries(
      Object.entries(globalBlocks).map((entry) => {
        const [key, value] = entry;
        const update = blocksData[key];

        if (!update) {
          return entry;
        }

        const value_ = produce(value, (draft) => {
          draft.data = update;
        });

        return [key, value_];
      })
    );
  }
);

export const getDefaultFontDetailsSelector = createSelector(
  defaultFontSelector,
  fontsSelector,
  (defaultFont, fonts) => {
    const groups = getGroupFontsById(fonts, defaultFont);

    if (groups) {
      return groups;
    }

    const [[group, { data = [] }]] = Object.entries(fonts) as NonEmptyArray<
      [FontKeyTypes, { data: Font[] }]
    >;

    return { group, font: data[0] };
  }
);

//#endregion

//#region === 3 DEPENDENCIES ===

// Retrieve the blockData of all normal blocks, including globalBlocks between normal blocks,
// excluding the top and bottom globalBlocks.
export const pageBlocksRawSelector = createSelector(
  blocksOrderRawSelector,
  globalBlocksSelector,
  blocksDataSelector,
  (blocksRawOrder, globalBlocks, blocksData) => {
    return blocksRawOrder.map((uid) => {
      if (globalBlocks[uid]) {
        return createGlobalBlockSymbol({ uid });
      }

      return blocksData[uid];
    });
  }
);

//#endregion

//#region === 4 DEPENDENCIES ===

// Retrieve the block data for all blocks, including globalBlocks
export const pageBlocksSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  blocksDataSelector,
  (blocksOrder, globalBlocks, blocksData) => {
    return blocksOrder.map((uid) => {
      if (globalBlocks[uid]) {
        return createGlobalBlockSymbol({ uid });
      }

      return blocksData[uid];
    });
  }
);

// Retrieve all blocks from the page, including their global blocks with data.
export const pageBlocksDataSelector = createSelector(
  blocksOrderSelector,
  globalBlocksAssembled2Selector,
  blocksDataSelector,
  pageSelector,
  configSelector,
  (blocksOrder, globalBlocks, blocksData, page, config): Array<Block> => {
    const blocks = blocksOrder.filter((uid) => {
      const globalBlock = globalBlocks[uid];

      if (globalBlock?.data) {
        return canUseCondition({ globalBlock, page, config });
      }
      return true;
    });

    return blocks.map((uid) => {
      if (globalBlocks[uid]?.data) {
        return globalBlocks[uid].data;
      }

      return blocksData[uid];
    });
  }
);

// Retrieve all blocks from the page, including their global blocks with data.
// Included new screenshots data used inside LeftSidebar
export const pageBlocksDataAssembledSelector = createSelector(
  pageBlocksDataSelector,
  screenshotsSelector,
  (blocksOrder, screenshots) => {
    return blocksOrder.map((data) => {
      const newScreenshot = screenshots[data.value._id];

      if (newScreenshot) {
        return produce(data, (draft) => {
          Object.assign(draft.value, newScreenshot);
        });
      }

      return data;
    });
  }
);

export const globalBlocksInPageSelector = createSelector(
  pageSelector,
  blocksOrderSelector,
  globalBlocksSelector,
  configSelector,
  (page, blocksOrder, globalBlocks, config) => {
    return blocksOrder.reduce<Record<string, GlobalBlock>>((acc, id) => {
      const globalBlock = globalBlocks[id];

      if (globalBlock && canUseCondition({ globalBlock, page, config })) {
        acc[id] = globalBlock;
      }

      return acc;
    }, {});
  }
);

// Retrieve all global blocks from the page, including their associated data.
// This is used when compiling a page with Node.js.
// The `canUseCondition` is intentionally omitted due to an older case where
// some global blocks have empty rules, causing issues in the middle of the compilation.
export const globalBlocksInPageRawSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  (blocksOrder, globalBlocks) => {
    return blocksOrder.reduce<Record<string, GlobalBlock>>((acc, id) => {
      const block = globalBlocks[id];

      if (block) {
        acc[id] = block;
      }

      return acc;
    }, {});
  }
);

// Retrieve all global popups from page, including their data.
// Used when try to compile page with node
export const globalPopupsInPageSelector = createSelector(
  pageBlocksDataSelector,
  globalBlocksSelector,
  (page, globalBlocks) => {
    const popups = new Map<string, GlobalBlockPopup>();
    objectTraverse2(page, (obj: Record<string, unknown>) => {
      const popupList = obj.linkPopupPopups ?? obj.popups;
      if (Array.isArray(popupList)) {
        popupList.forEach((popup) => {
          if (popup.type === "GlobalBlock" && globalBlocks[popup.value._id]) {
            popups.set(
              popup.value._id,
              globalBlocks[popup.value._id] as GlobalBlockPopup
            );
          }
        });
      }
    });

    return [...popups].map(([, data]) => data);
  }
);

export const globalBlocksAssembledSelector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  screenshotsSelector,
  (globalBlocks, blocksData, screenshots): Record<string, GlobalBlock> => {
    return objectFromEntries(
      Object.entries(globalBlocks).map((entry) => {
        const [key, value] = entry;
        const update = blocksData[key];
        const screenshot = screenshots[key];

        const value_ = produce(value, (draft) => {
          draft.data = { ...draft.data, ...update };

          if (screenshot) {
            Object.assign(draft.data.value, screenshot);
            Object.assign(draft.meta, screenshot);
          }

          objectTraverse2(draft.data.value, (obj: ElementModel) => {
            const _id = getIn(obj, ["value", "_id"]) as MValue<string>;
            if (
              obj.type &&
              obj.type !== "GlobalBlock" &&
              obj.value &&
              _id &&
              screenshots[_id]
            ) {
              obj.meta = obj.meta || {};
              Object.assign(obj.value, screenshots[_id]);
              // @ts-expect-error: Argument of type unknown is not assignable to parameter of type {}
              Object.assign(obj.meta, screenshots[_id]);
            }
          });
        });

        return [key, value_];
      })
    );
  }
);

//#endregion

//#region === ANOMALIES ===

export const pageDataDraftBlocksSelector = createSelector(
  pageDataSelector,
  pageBlocksSelector,
  (pageData, pageBlocks) =>
    produce(pageData, (draft) => {
      draft.items = pageBlocks;
    })
);

// All global blocks are replaced with their data.
// Check if all global blocks are included in the current page.
// This is used for the Publish button when trying to save the layout.
export const pageDataNoRefsSelector2 = createSelector(
  pageDataSelector,
  pageBlocksDataSelector,
  (pageData, pageBlocks) =>
    produce(pageData, (draft) => {
      draft.items = pageBlocks;
    })
);

// all global block refs are replaced with their data
export const pageDataNoRefsSelector = createSelector(
  pageDataDraftBlocksSelector,
  globalBlocksAssembled2Selector,
  (pageData, globalBlocks) => {
    return transformData(pageData);

    function transformData(data: Record<string, unknown>) {
      return mapModels((model: ElementModelType) => {
        if (model.type === "GlobalBlock") {
          const { _id } = model.value;

          if (_id && globalBlocks[_id] && globalBlocks[_id].data) {
            return globalBlocks[_id].data;
          }
        }

        return model;
      }, data);
    }
  }
);

export const popupBlocksInPageSelector = createSelector(
  pageDataDraftBlocksSelector,
  getModelPopups
);

//#endregion

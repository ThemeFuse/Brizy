import { produce } from "immer";
import { createSelector } from "reselect";
import { ElementModelType } from "visual/component/Elements/Types";
import { isShopifyPage } from "visual/global/Config/types/configs/Cloud";
import { FontKeyTypes } from "visual/redux/actions2";
import { ReduxState, StoreChanged } from "visual/redux/types";
import { Authorized, Font, GlobalBlock, SyncAllowed } from "visual/types";
import { NonEmptyArray } from "visual/utils/array/types";
import { canUseCondition, createGlobalBlockSymbol } from "visual/utils/blocks";
import { getSurroundedGBIds } from "visual/utils/blocks/blocksConditions";
import { getGroupFontsById } from "visual/utils/fonts";
import { mapModels } from "visual/utils/models";
import { objectFromEntries } from "visual/utils/object";

//#region === 0 DEPENDENCIES ===

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

//#endregion

//#region === 1 DEPENDENCIES ===

export const pageDataSelector = createSelector(
  pageSelector,
  (page) => page.data || {}
);

export const disabledElementsSelector = createSelector(
  projectSelector,
  (project) => project.data.disabledElements || []
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

export const pageLayout = createSelector(pageSelector, (page) => {
  if (isShopifyPage(page)) {
    return page.layout;
  }

  return undefined;
});

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

// published globalBlocks + their updates
// this is used when rendering globalBlocks refs in the page
// and purposefully omits screenshots, to prevent a re-render when screenshots change
export const globalBlocksAssembled2Selector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  (globalBlocks, blocksData) => {
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
  (blocksOrder, globalBlocks, blocksData, page) => {
    const blocks = blocksOrder.filter((uid) => {
      if (globalBlocks[uid]?.data) {
        return canUseCondition(globalBlocks[uid], page);
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

export const globalBlocksInPageSelector = createSelector(
  pageSelector,
  blocksOrderSelector,
  globalBlocksSelector,
  (page, blocksOrder, globalBlocks) => {
    return blocksOrder.reduce<Record<string, GlobalBlock>>((acc, id) => {
      if (globalBlocks[id] && canUseCondition(globalBlocks[id], page)) {
        acc[id] = globalBlocks[id];
      }

      return acc;
    }, {});
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

export const pageBlocksNoRefsSelector = createSelector(
  pageDataNoRefsSelector,
  (pageData) => pageData.items || []
);

// export const popupBlocksInPageSelector = createSelector(
//   pageBlocksNoRefsSelector,
//   (pageBlocksNoRefs) => {
//     const popups: Array<Block> = [];
//     objectTraverse2(pageBlocksNoRefs, (obj: Record<string, unknown>) => {
//       if (Array.isArray(obj.popups)) {
//         popups.push(...obj.popups);
//       }
//     });
//
//     return uniq(popups, (p) => p.value._id);
//   }
// );

//#endregion

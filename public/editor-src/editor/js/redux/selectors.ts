import { Obj, Str } from "@brizy/readers";
import { omit } from "es-toolkit";
import { produce } from "immer";
import { createSelector } from "reselect";
import { getIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import configRules from "visual/config/rules";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { FontKeyTypes } from "visual/redux/actions2";
import { ReduxState, StoreChanged } from "visual/redux/types";
import { Authorized, SyncAllowed } from "visual/types";
import { Block, BlocksHTML } from "visual/types/Block";
import { Font } from "visual/types/Fonts";
import { GlobalBlock, GlobalBlockPopup } from "visual/types/GlobalBlock";
import { NonEmptyArray } from "visual/utils/array/types";
import { canUseCondition, createGlobalBlockSymbol } from "visual/utils/blocks";
import { getPositions } from "visual/utils/blocks/blocksConditions";
import { getSurroundedGBIds } from "visual/utils/blocks/blocksConditions";
import { getModelPopups } from "visual/utils/blocks/getModelPopups";
import { getGroupFontsById } from "visual/utils/fonts/getFontById";
import { mapModels } from "visual/utils/models";
import { objectFromEntries, objectTraverse2 } from "visual/utils/object";
import { MValue } from "visual/utils/value";

//#region === 0 DEPENDENCIES ===

// this selector is used solely to config parameter that are unrelated to the redux store
// and to maintain memoization
export const configSelector = (
  _: ReduxState,
  config: ConfigCommon
): ConfigCommon => config;

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

export const blocksHtmlSelector = (
  state: ReduxState
): ReduxState["blocksHtml"] => state.blocksHtml;

export const symbolsSelector = (state: ReduxState): ReduxState["symbols"] =>
  state.symbols;

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

export const drawerContentTypeSelector = createSelector(
  leftSidebarSelector,
  (leftSidebar) => leftSidebar.drawerContentType
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

export const globalBlocksWithoutPopupsSelector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  (globalBlocks, blocksData) => {
    return Object.entries(globalBlocks).reduce(
      (acc, [id, value]) => {
        // it happens only when globalBlock was Added and than
        // button UNDO was pressed
        if (!blocksData[id]) {
          return acc;
        }
        const isPopup =
          blocksData[id].type === "SectionPopup" ||
          blocksData[id].type === "SectionPopup2";

        if (!isPopup) {
          acc[id] = value;
        }

        return acc;
      },
      {} as Record<string, GlobalBlock>
    );
  }
);

export const rulesSelector = createSelector(
  currentStyleSelector,
  extraFontStylesSelector,
  (currentStyle, extraFontStyles) => {
    const { colorPalette, fontStyles } = currentStyle;
    const mergedFontStyles = fontStyles.concat(extraFontStyles);

    const generatedColorRules = colorPalette.reduce(
      (acc, color) => ({
        ...acc,
        [`${color.id}__color`]: {
          colorHex: color.hex
        },
        [`${color.id}__hoverColor`]: {
          hoverColorHex: color.hex
        },
        [`${color.id}__bg`]: {
          bgColorHex: color.hex
        },
        [`${color.id}__hoverBg`]: {
          hoverBgColorHex: color.hex
        },
        [`${color.id}__gradient`]: {
          gradientColorHex: color.hex
        },
        [`${color.id}__hoverGradient`]: {
          hoverGradientColorHex: color.hex
        },
        [`${color.id}__bg2`]: {
          bg2ColorHex: color.hex
        },
        [`${color.id}__border`]: {
          borderColorHex: color.hex
        },
        [`${color.id}__hoverBorder`]: {
          hoverBorderColorHex: color.hex
        },
        [`${color.id}__arrowsColor`]: {
          sliderArrowsColorHex: color.hex
        },
        [`${color.id}__dotsColor`]: {
          sliderDotsColorHex: color.hex
        },
        [`${color.id}__boxShadow`]: {
          boxShadowColorHex: color.hex
        },
        [`${color.id}__shapeTopColor`]: {
          shapeTopColorHex: color.hex
        },
        [`${color.id}__shapeBottomColor`]: {
          shapeBottomColorHex: color.hex
        },
        [`${color.id}__paginationColor`]: {
          paginationColorHex: color.hex
        },
        [`${color.id}__tabletBg`]: {
          tabletBgColorHex: color.hex
        },
        [`${color.id}__tabletBorder`]: {
          tabletBorderColorHex: color.hex
        },
        [`${color.id}__mobileBg`]: {
          mobileBgColorHex: color.hex
        },
        [`${color.id}__mobileBorder`]: {
          mobileBorderColorHex: color.hex
        },
        [`${color.id}__subMenuColor`]: {
          subMenuColorHex: color.hex
        },
        [`${color.id}__subMenuHoverColor`]: {
          subMenuHoverColorHex: color.hex
        },
        [`${color.id}__subMenuBgColor`]: {
          subMenuBgColorHex: color.hex
        },
        [`${color.id}__subMenuHoverBgColor`]: {
          subMenuHoverBgColorHex: color.hex
        },
        [`${color.id}__subMenuBorderColor`]: {
          subMenuBorderColorHex: color.hex
        },
        [`${color.id}__mMenuColor`]: {
          mMenuColorHex: color.hex
        },
        [`${color.id}__mMenuHoverColor`]: {
          mMenuHoverColorHex: color.hex
        },
        [`${color.id}__mMenuBgColor`]: {
          mMenuBgColorHex: color.hex
        },
        [`${color.id}__mMenuBorderColor`]: {
          mMenuBorderColorHex: color.hex
        },
        [`${color.id}__mMenuIconColor`]: {
          mMenuIconColorHex: color.hex
        },
        [`${color.id}__tabletMMenuIconColor`]: {
          tabletMMenuIconColorHex: color.hex
        },
        [`${color.id}__mobileMMenuIconColor`]: {
          mobileMMenuIconColorHex: color.hex
        },
        [`${color.id}__labelColor`]: {
          labelColorHex: color.hex
        },
        [`${color.id}__checkboxColor`]: {
          checkboxColorHex: color.hex
        },
        [`${color.id}__selectColor`]: {
          selectColorHex: color.hex
        },
        [`${color.id}__hoverSelectColor`]: {
          hoverSelectColorHex: color.hex
        },
        [`${color.id}__selectBg`]: {
          selectBgColorHex: color.hex
        },
        [`${color.id}__hoverSelectBg`]: {
          hoverSelectBgColorHex: color.hex
        },
        [`${color.id}__selectBorderColor`]: {
          selectBorderColorHex: color.hex
        },
        [`${color.id}__hoverSelectBorderColor`]: {
          hoverSelectBorderColorHex: color.hex
        },
        [`${color.id}__selectBoxShadow`]: {
          selectBoxShadowColorHex: color.hex
        },
        [`${color.id}__hoverSelectBoxShadow`]: {
          hoverSelectBoxShadowColorHex: color.hex
        }
      }),
      {}
    );
    const generatedFontRules = mergedFontStyles.reduce(
      (acc, font) => ({
        ...acc,
        [`${font.id}__fsDesktop`]: {
          fontFamily: font.fontFamily,
          fontFamilyType: font.fontFamilyType,
          fontSize: font.fontSize,
          fontSizeSuffix: font.fontSizeSuffix ?? "px",
          fontWeight: font.fontWeight,
          lineHeight: font.lineHeight,
          letterSpacing: font.letterSpacing
        },
        [`${font.id}__fsTablet`]: {
          tabletFontSize: font.tabletFontSize,
          tabletFontSizeSuffix: font.tabletFontSizeSuffix ?? "px",
          tabletFontWeight: font.tabletFontWeight,
          tabletLineHeight: font.tabletLineHeight,
          tabletLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__fsMobile`]: {
          mobileFontSize: font.mobileFontSize,
          mobileFontSizeSuffix: font.mobileFontSizeSuffix ?? "px",
          mobileFontWeight: font.mobileFontWeight,
          mobileLineHeight: font.mobileLineHeight,
          mobileLetterSpacing: font.mobileLetterSpacing
        },
        [`${font.id}__subMenuFsDesktop`]: {
          subMenuFontFamily: font.fontFamily,
          subMenuFontFamilyType: font.fontFamilyType,
          subMenuFontSize: font.fontSize,
          subMenuFontSizeSuffix: font.fontSizeSuffix ?? "px",
          subMenuFontWeight: font.fontWeight,
          subMenuLineHeight: font.lineHeight,
          subMenuLetterSpacing: font.letterSpacing
        },
        [`${font.id}__subMenuFsTablet`]: {
          tabletSubMenuFontSize: font.tabletFontSize,
          tabletSubMenuFontSizeSuffix: font.tabletFontSizeSuffix ?? "px",
          tabletSubMenuFontWeight: font.tabletFontWeight,
          tabletSubMenuLineHeight: font.tabletLineHeight,
          tabletSubMenuLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__subMenuFsMobile`]: {
          mobileSubMenuFontSize: font.mobileFontSize,
          mobileSubMenuFontSizeSuffix: font.mobileFontSizeSuffix ?? "px",
          mobileSubMenuFontWeight: font.mobileFontWeight,
          mobileSubMenuLineHeight: font.mobileLineHeight,
          mobileSubMenuLetterSpacing: font.mobileLetterSpacing
        },
        [`${font.id}__mMenuFsDesktop`]: {
          mMenuFontFamily: font.fontFamily,
          mMenuFontFamilyType: font.fontFamilyType,
          mMenuFontSize: font.fontSize,
          mMenuFontSizeSuffix: font.fontSizeSuffix ?? "px",
          mMenuFontWeight: font.fontWeight,
          mMenuLineHeight: font.lineHeight,
          mMenuLetterSpacing: font.letterSpacing
        },
        [`${font.id}__mMenuFsTablet`]: {
          tabletMMenuFontSize: font.tabletFontSize,
          tabletMMenuFontSizeSuffix: font.tabletFontSizeSuffix ?? "px",
          tabletMMenuFontWeight: font.tabletFontWeight,
          tabletMMenuLineHeight: font.tabletLineHeight,
          tabletMMenuLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__mMenuFsMobile`]: {
          mobileMMenuFontSize: font.mobileFontSize,
          mobileMMenuFontSizeSuffix: font.mobileFontSizeSuffix ?? "px",
          mobileMMenuFontWeight: font.mobileFontWeight,
          mobileMMenuLineHeight: font.mobileLineHeight,
          mobileMMenuLetterSpacing: font.mobileLetterSpacing
        }
      }),
      {}
    );

    return {
      ...configRules,
      ...generatedColorRules,
      ...generatedFontRules
    };
  }
);

export const copiedElementNoRefsSelector = createSelector(
  copiedElementSelector,
  globalBlocksAssembled2Selector,
  (copiedElement, globalBlocks) => {
    return produce(copiedElement, (draft) => {
      objectTraverse2(draft, (obj: Record<string, unknown>) => {
        if (obj.type && obj.type === "GlobalBlock" && Obj.isObject(obj.value)) {
          const { _id } = obj.value;
          const id = Str.read(_id);

          if (id && globalBlocks[id]) {
            Object.assign(obj, globalBlocks[id].data);
          }
        }
      });
    });
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

// Retrieve all blocksHTML of all normal blocks, including globalBlocks between normal blocks,
// excluding the top & bottom globalBlocks.
// Used when publishing and preparing block HTML for the page.
// Middle global blocks are replaced with a placeholder.
export const blocksHtmlRawSelector = createSelector(
  pageBlocksRawSelector,
  blocksHtmlSelector,
  (blockOrders, blocksHtml) => {
    return blockOrders.map((block) => {
      const blockId = block.value._id;
      const html = blocksHtml.blocks[blockId];

      if (block.type === "GlobalBlock") {
        return {
          id: blockId,
          ...html,
          html: `{{ brizy_dc_global_block uid="${blockId}" }}`
        };
      }

      return {
        id: blockId,
        ...html
      };
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
  (state: ReduxState, config: ConfigCommon) =>
    pageBlocksDataSelector(state, config),
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
  (state: ReduxState, config: ConfigCommon) =>
    pageBlocksDataSelector(state, config),
  globalBlocksAssembled2Selector,
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

// Retrieve the IDs of all globalBlocks from current page,
// including global popups
export const globalBlocksIdsInPageWithPopupsSelector = createSelector(
  (s: ReduxState, c: ConfigCommon) => globalPopupsInPageSelector(s, c),
  blocksOrderSelector,
  globalBlocksSelector,
  (popups, blocksOrder, globalBlocks) => {
    const blocksIds = blocksOrder.filter((id) => globalBlocks[id]);
    const popupsIds = popups.map((popup) => popup.uid);
    return Array.from(new Set([...blocksIds, ...popupsIds]));
  }
);

// Retrieve the IDs of all globalBlocks from current page without global popups
export const globalBlocksIdsInPageSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  (blocksOrder, globalBlocks) => {
    const blocksIds = blocksOrder.filter((id) => globalBlocks[id]);
    return blocksIds;
  }
);

// Retrieve HTML of all globalBlocks with globalPopups from the current page,
// used when compiling the page inside the browser.
export const globalBlocksHTMLInPageSelector = createSelector(
  globalBlocksIdsInPageWithPopupsSelector,
  blocksHtmlSelector,
  (blocks, blocksHtml) => {
    return blocks.reduce(
      (acc, uid) => {
        acc[uid] = blocksHtml.blocks[uid];
        return acc;
      },
      {} as Record<string, BlocksHTML>
    );
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

export const globalBlocksPositionsSelector = createSelector(
  pageSelector,
  globalBlocksSelector,
  blocksOrderSelector,
  globalBlocksWithoutPopupsSelector,
  configSelector,
  (page, globalBlocks, blocksOrder, globalBlocksWithoutPopups, config) => {
    const newBlocksOrder = blocksOrder.filter((_id) => {
      const globalBlock = globalBlocks[_id];

      if (globalBlock) {
        return canUseCondition({ globalBlock, page, config });
      }

      return true;
    });

    return getPositions(newBlocksOrder, globalBlocksWithoutPopups);
  }
);

//#endregion

// === 6 DEPENDENCIES ===

export const projectAssembled = createSelector(
  projectSelector,
  filteredFontsSelector,
  stylesSelector,
  extraStylesSelector,
  currentStyleIdSelector,
  currentStyleSelector,
  extraFontStylesSelector,
  (
    project,
    fonts,
    styles,
    extraStyles,
    currentStyleId,
    currentStyle,
    extraFontStyles
  ) => {
    return produce(project, (draft) => {
      draft.data.fonts = omit(fonts, ["system"]);
      draft.data.styles = styles;
      draft.data.selectedStyle = currentStyleId;
      draft.data.extraFontStyles = extraFontStyles;
      draft.data.extraStyles = extraStyles;

      for (let i = 0; i < draft.data.styles.length; i++) {
        if (draft.data.styles[i].id === currentStyle.id) {
          draft.data.styles[i] = currentStyle;
        }
      }
    });
  }
);

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
  (state: ReduxState, config: ConfigCommon) =>
    pageBlocksDataSelector(state, config),
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
  globalBlocksAssembledSelector,
  getModelPopups
);

export const pageAssembledRawSelector = createSelector(
  pageSelector,
  pageBlocksRawSelector,
  screenshotsSelector,
  (page, blocks, screenshots) => {
    return produce(page, (draft) => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj: Record<string, unknown>) => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            Obj.isObject(obj.value) &&
            Str.is(obj.value._id)
          ) {
            if (screenshots[obj.value._id]) {
              Object.assign(obj.value, screenshots[obj.value._id]);
            }
          }
        });
      }
    });
  }
);

export const pageAssembledSelector = createSelector(
  pageSelector,
  pageBlocksSelector,
  screenshotsSelector,
  (page, blocks, screenshots) => {
    return produce(page, (draft) => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj: Record<string, unknown>) => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            Obj.isObject(obj.value) &&
            Str.is(obj.value._id) &&
            screenshots[obj.value._id]
          ) {
            Object.assign(obj.value, screenshots[obj.value._id]);
          }
        });
      }
    });
  }
);

//#endregion

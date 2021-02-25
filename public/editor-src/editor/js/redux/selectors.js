import { createSelector } from "reselect";
import produce from "immer";
import configRules from "visual/config/rules";
import { objectTraverse2, objectFromEntries } from "visual/utils/object";
import { mapModels } from "visual/utils/models";
import { canUseConditionInPage } from "visual/utils/blocks";

import {
  getPositions,
  getSurroundedGBIds
} from "visual/utils/blocks/blocksConditions";
import {
  pageSelector,
  fontSelector,
  extraFontStylesSelector,
  uiSelector
} from "./selectors-new";

// temporary until all selectors won't be migrated to TS
export * from "./selectors-new";

// === 0 DEPENDENCIES ===
export const screenshotsSelector = state => state.screenshots || {};

export const globalBlocksSelector = state => state.globalBlocks || {};

export const changedGBIdsSelector = state => state.changedGBIds || {};

export const blocksDataSelector = state => state.blocksData || {};

export const blocksOrderSelector = state => state.blocksOrder || [];

export const projectSelector = state => state.project || {};

export const stylesSelector = state => state.styles || [];

export const copiedElementSelector = state => state.copiedElement;

export const currentStyleIdSelector = state => state.currentStyleId;

export const currentStyleSelector = state => state.currentStyle;

export const errorSelector = state => state.error;

// === END 0 DEPENDENCIES ===

// === 1 DEPENDENCY ===

export const disabledElementsSelector = createSelector(
  projectSelector,
  project => project.data.disabledElements || []
);

export const pageDataSelector = createSelector(
  pageSelector,
  page => page.data || {}
);

export const pageSlugSelector = createSelector(pageSelector, page => page.slug);

export const triggersSelector = createSelector(
  pageDataSelector,
  pageData => pageData.triggers || []
);

export const triggersAmountSelector = createSelector(
  pageDataSelector,
  pageData => (pageData.triggers ? pageData.triggers.length : null)
);

export const rulesAmountSelector = createSelector(pageDataSelector, pageData =>
  Number.isInteger(pageData.rulesAmount) ? pageData.rulesAmount : null
);

export const deviceModeSelector = createSelector(
  uiSelector,
  ui => ui.deviceMode
);

export const showHiddenElementsSelector = createSelector(
  uiSelector,
  ui => ui.showHiddenElements
);

export const currentRoleSelector = createSelector(
  uiSelector,
  ui => ui.currentRole
);

// === END 1 DEPENDENCY ===

// === 2 DEPENDENCIES ===

export const blocksOrderRawSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  (blocksOrder, globalBlocks) => {
    const globalBlocksIds = Object.keys(globalBlocks);
    const { top, bottom } = getSurroundedGBIds(blocksOrder, globalBlocksIds);

    return blocksOrder.filter(id => !top.includes(id) && !bottom.includes(id));
  }
);

export const globalBlocksWithoutPopupsSelector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  (globalBlocks, blocksData) => {
    return Object.entries(globalBlocks).reduce((acc, [id, value]) => {
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
    }, {});
  }
);

export const globalBlocksPositionsSelector = createSelector(
  pageSelector,
  globalBlocksSelector,
  blocksOrderSelector,
  globalBlocksWithoutPopupsSelector,
  (page, globalBlocks, blocksOrder, globalBlocksWithoutPopups) => {
    const newBlocksOrder = blocksOrder.filter(_id => {
      if (globalBlocks[_id]) {
        return canUseConditionInPage(globalBlocks[_id], page);
      }

      return true;
    });

    return getPositions(newBlocksOrder, globalBlocksWithoutPopups);
  }
);

// ! Add new selector for popups globalBlocks/

export const globalBlocksAssembledSelector = createSelector(
  globalBlocksSelector,
  blocksDataSelector,
  screenshotsSelector,
  (globalBlocks, blocksData, screenshots) => {
    return objectFromEntries(
      Object.entries(globalBlocks).map(entry => {
        const [key, value] = entry;
        const update = blocksData[key];
        const screenshot = screenshots[key];

        const value_ = produce(value, draft => {
          draft.data = { ...draft.data, ...update };

          if (screenshot) {
            Object.assign(draft.data.value, screenshot);
          }

          objectTraverse2(draft.data.value, obj => {
            if (
              obj.type &&
              obj.type !== "GlobalBlock" &&
              obj.value &&
              obj.value._id &&
              screenshots[obj.value._id]
            ) {
              Object.assign(obj.value, screenshots[obj.value._id]);
            }
          });
        });

        return [key, value_];
      })
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
      Object.entries(globalBlocks).map(entry => {
        const [key, value] = entry;
        const update = blocksData[key];

        if (!update) {
          return entry;
        }

        const value_ = produce(value, draft => {
          draft.data = update;
        });

        return [key, value_];
      })
    );
  }
);

export const globalBlocksInPageSelector = createSelector(
  pageSelector,
  blocksOrderSelector,
  globalBlocksSelector,
  (page, blocksOrder, globalBlocks) => {
    return blocksOrder.reduce((acc, id) => {
      if (globalBlocks[id] && canUseConditionInPage(globalBlocks[id], page)) {
        acc[id] = globalBlocks[id];
      }

      return acc;
    }, {});
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
    return produce(copiedElement, draft => {
      objectTraverse2(draft, obj => {
        if (obj.type && obj.type === "GlobalBlock" && obj.value) {
          const { _id } = obj.value;

          if (globalBlocks[_id]) {
            Object.assign(obj, globalBlocks[_id].data);
          }
        }
      });
    });
  }
);

// === END 2 DEPENDENCIES ===

// === 3 DEPENDENCIES ===

export const pageBlocksSelector = createSelector(
  blocksOrderSelector,
  globalBlocksSelector,
  blocksDataSelector,
  (blocksOrder, globalBlocks, blocksData) => {
    // ! is it a good solution?!
    const globalBlocksIds = Object.keys(globalBlocks);

    return blocksOrder.map(id => {
      if (globalBlocksIds.includes(id)) {
        return {
          type: "GlobalBlock",
          value: {
            _id: id
          }
        };
      }

      return blocksData[id];
    });
  }
);

export const pageBlocksRawSelector = createSelector(
  blocksOrderRawSelector,
  globalBlocksSelector,
  blocksDataSelector,
  (blocksRawOrder, globalBlocks, blocksData) => {
    // ! is it a good solution?!
    const globalBlocksIds = Object.keys(globalBlocks);

    return blocksRawOrder.map(id => {
      if (globalBlocksIds.includes(id)) {
        return {
          type: "GlobalBlock",
          value: {
            _id: id
          }
        };
      }

      return blocksData[id];
    });
  }
);

// ==== END 3 DEPENDENCIES ===

// === 6 DEPENDENCIES ===

export const projectAssembled = createSelector(
  projectSelector,
  fontSelector,
  stylesSelector,
  currentStyleIdSelector,
  currentStyleSelector,
  extraFontStylesSelector,
  (project, fonts, styles, currentStyleId, currentStyle, extraFontStyles) => {
    return produce(project, draft => {
      draft.data.fonts = fonts;
      draft.data.styles = styles;
      draft.data.selectedStyle = currentStyleId;
      draft.data.extraFontStyles = extraFontStyles;

      for (let i = 0; i < draft.data.styles.length; i++) {
        if (draft.data.styles[i].id === currentStyle.id) {
          draft.data.styles[i] = currentStyle;
        }
      }
    });
  }
);

// === END 6 DEPENDENCIES ===

// === ANOMALIES ===

export const pageDataDraftBlocksSelector = createSelector(
  pageDataSelector,
  pageBlocksSelector,
  (pageData, pageBlocks) =>
    produce(pageData, draft => {
      draft.items = pageBlocks;
    })
);

// all global block refs are replaced with their data
export const pageDataNoRefsSelector = createSelector(
  pageDataDraftBlocksSelector,
  globalBlocksAssembled2Selector,
  (pageData, globalBlocks) => {
    return transformData(pageData);

    function transformData(data) {
      return mapModels(model => {
        if (model.type === "GlobalBlock") {
          const { _id } = model.value;

          return globalBlocks[_id]?.data;
        }

        return model;
      }, data);
    }
  }
);

export const pageBlocksNoRefsSelector = createSelector(
  pageDataNoRefsSelector,
  pageData => pageData.items || []
);

export const popupBlocksInPageSelector = createSelector(
  pageBlocksNoRefsSelector,
  pageBlocksNoRefs => {
    const popups = [];
    objectTraverse2(pageBlocksNoRefs, obj => {
      if (obj.popups) {
        popups.push(...obj.popups);
      }
    });

    return popups;
  }
);

export const pageAssembledRawSelector = createSelector(
  pageSelector,
  pageBlocksRawSelector,
  screenshotsSelector,
  (page, blocks, screenshots) => {
    return produce(page, draft => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, obj => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            obj.value &&
            obj.value._id &&
            screenshots[obj.value._id]
          ) {
            Object.assign(obj.value, screenshots[obj.value._id]);
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
    return produce(page, draft => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, obj => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            obj.value &&
            obj.value._id &&
            screenshots[obj.value._id]
          ) {
            Object.assign(obj.value, screenshots[obj.value._id]);
          }
        });
      }
    });
  }
);

export const pageBlocksAssembledSelector = createSelector(
  pageBlocksSelector,
  screenshotsSelector,
  (blocks, screenshots) => {
    return produce(blocks, draft => {
      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, obj => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            obj.value &&
            obj.value._id &&
            screenshots[obj.value._id]
          ) {
            Object.assign(obj.value, screenshots[obj.value._id]);
          }
        });
      }
    });
  }
);

export const pageBlocksAssembledRawSelector = createSelector(
  pageSelector,
  pageBlocksSelector,
  globalBlocksSelector,
  screenshotsSelector,
  (page, blocks, globalBlocks, screenshots) => {
    const newBlocks = blocks.filter(block => {
      if (block.type === "GlobalBlock") {
        const { _id } = block.value;

        return canUseConditionInPage(globalBlocks[_id], page);
      }

      return true;
    });

    return produce(newBlocks, draft => {
      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, obj => {
          if (
            obj.type &&
            obj.type !== "GlobalBlock" &&
            obj.value &&
            obj.value._id &&
            screenshots[obj.value._id]
          ) {
            Object.assign(obj.value, screenshots[obj.value._id]);
          }
        });
      }
    });
  }
);

// === END ANOMALIES ===

import { omit } from "es-toolkit";
import { produce } from "immer";
import { createSelector } from "reselect";
import configRules from "visual/config/rules";
import { getPositions } from "visual/utils/blocks/blocksConditions";
import { canUseCondition } from "visual/utils/blocks/getAllowedGBIds";
import { objectTraverse2 } from "visual/utils/object";
import {
  blocksDataSelector,
  blocksOrderSelector,
  configSelector,
  copiedElementSelector,
  currentStyleIdSelector,
  currentStyleSelector,
  extraFontStylesSelector,
  extraStylesSelector,
  filteredFontsSelector,
  globalBlocksAssembled2Selector,
  globalBlocksSelector,
  pageBlocksRawSelector,
  pageBlocksSelector,
  pageSelector,
  projectSelector,
  screenshotsSelector,
  stylesSelector
} from "./selectors-new";

// temporary until all selectors won't be migrated to TS
export * from "./selectors-new";

// === 2 DEPENDENCIES ===

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

// ! Add new selector for popups globalBlocks/

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
      objectTraverse2(draft, (obj) => {
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
      draft.data.fonts = omit(fonts, "system");
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

// === END 6 DEPENDENCIES ===

// === ANOMALIES ===

export const pageAssembledRawSelector = createSelector(
  pageSelector,
  pageBlocksRawSelector,
  screenshotsSelector,
  (page, blocks, screenshots) => {
    return produce(page, (draft) => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj) => {
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
    return produce(page, (draft) => {
      draft.data.items = blocks;

      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj) => {
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
    return produce(blocks, (draft) => {
      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj) => {
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
  configSelector,
  (page, blocks, globalBlocks, screenshots, config) => {
    const newBlocks = blocks.filter((block) => {
      if (block.type === "GlobalBlock") {
        const { _id } = block.value;
        const globalBlock = globalBlocks[_id];

        // If the data is missing, globalBlocks was deleted.
        if (!globalBlock?.data) {
          return false;
        }

        return canUseCondition({ globalBlock, page, config });
      }

      return true;
    });

    return produce(newBlocks, (draft) => {
      if (Object.keys(screenshots).length > 0) {
        objectTraverse2(draft, (obj) => {
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

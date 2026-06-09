// Block utilities
export {
  buildElementSummary,
  cloneBlockWithNewIds,
  createDefaultBlock,
  parseBackendBlockData
} from "./block";

// DND utilities
export {
  buildAddableFromTo,
  buildMoveFromTo,
  mapToDndContainerType
} from "./dnd";

// Element utilities
export {
  correctContainerForElement,
  createDefaultElement,
  duplicateElementInBlock,
  getNestedValue,
  getShortcodeKey,
  isColumnElement,
  isRowElement,
  isWrappersTypeElement,
  removeElementFromBlock,
  updateColumnInRow
} from "./element";
export type {
  ContainerCorrectionResult,
  DuplicateElementInBlockResult,
  RemoveElementFromBlockResult,
  UpdateColumnInRowResult
} from "./element";

// RichText utilities
export {
  applyRichTextUpdates,
  applyTypographyStyles,
  findAndReplaceInHtml,
  isFontStyle,
  replaceAllTextInHtml,
  updateRichTextColor
} from "./richtext";
export type { FontStyleTypes, UpdateRichTextParams } from "./richtext";

// Project utilities
export {
  addStyleSchema,
  buildNewStyle,
  duplicateCurrentStyle,
  mergeStyleUpdate,
  toFontSummaries,
  toStyleDetail,
  toStyleSummary,
  updateStyleSchema
} from "./project";
export type { AddStyleInput, UpdateStyleInput } from "./project";

// Search utilities
export {
  applyFuzzySearch,
  collectElements,
  searchInElement,
  toSearchResults
} from "./search";
export type { InternalSearchResult } from "./search";

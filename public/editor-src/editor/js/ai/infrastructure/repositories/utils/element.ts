import { getIn, setIn } from "timm";
import type {
  ElementModelType,
  ElementModelType2
} from "visual/component/Elements/Types";
import { removeIn } from "visual/editorComponents/Page/utils/helpers/addRemove";
import { createNewItem } from "visual/editorComponents/Page/utils/helpers/move";
import { normalizeRowColumns } from "visual/editorComponents/Row/utils";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { getSampleShortCodes } from "visual/shortcodeComponents/Shortcodes";
import type { Block } from "visual/types/Block";
import { setIds } from "visual/utils/models";
import { MValue } from "visual/utils/value";

// ===========================================
// ELEMENT TYPE TO SHORTCODE MAPPING
// ===========================================

/**
 * Maps element types from AI tool definitions to shortcode keys.
 * This is needed because the AI uses semantic names (e.g., "RichText")
 * while shortcodes use different keys (e.g., "Text").
 */
const ELEMENT_TYPE_TO_SHORTCODE: Record<string, string> = {
  [ElementTypes.RichText]: "Text",
  [ElementTypes.EmbedCode]: "Embed"
};

/**
 * Get the shortcode key for an element type.
 * Returns the mapped key if a mapping exists, otherwise returns the original type.
 */
export function getShortcodeKey(elementType: string): string {
  return ELEMENT_TYPE_TO_SHORTCODE[elementType] ?? elementType;
}

// ===========================================
// CONTAINER RULES CONFIGURATION
// ===========================================

const FIRST_ITEM_PATH = ["value", "items", "0"];

/**
 * Containers that auto-redirect to their first child.
 * When user targets these, we navigate to the actual container inside.
 */
const CONTAINER_REDIRECTS: Record<string, true> = {
  [ElementTypes.Section]: true,
  [ElementTypes.SectionHeader]: true,
  [ElementTypes.Switcher]: true,
  [ElementTypes.Flipbox]: true,
  [ElementTypes.Wrapper]: true,
  [ElementTypes.Wrapper2]: true
};

/**
 * Element restrictions per container type.
 * - allowOnly: whitelist (only these elements allowed)
 * - forbidden: blacklist (these elements blocked)
 * - maxChildren: maximum number of children allowed
 * - minChildren: minimum number of children required (prevents removing the last item)
 *
 * If a container is not listed here, it accepts any element.
 */
const CONTAINER_RESTRICTIONS: Record<
  string,
  {
    allowOnly?: string[];
    forbidden?: string[];
    maxChildren?: number;
    minChildren?: number;
  }
> = {
  [ElementTypes.Cloneable]: {
    allowOnly: [ElementTypes.Button, ElementTypes.Icon]
  },
  [ElementTypes.Wrapper]: {
    forbidden: [
      ElementTypes.Wrapper,
      ElementTypes.Wrapper2,
      ElementTypes.Cloneable,
      ElementTypes.Button,
      ElementTypes.Icon
    ],
    maxChildren: 1
  },
  [ElementTypes.Wrapper2]: {
    forbidden: [
      ElementTypes.Wrapper,
      ElementTypes.Wrapper2,
      ElementTypes.Cloneable
    ]
  },
  [ElementTypes.Row]: {
    allowOnly: [ElementTypes.Column],
    maxChildren: 6
  },
  [ElementTypes.Switcher]: {
    allowOnly: [ElementTypes.SwitcherTab]
  },
  [ElementTypes.Flipbox]: {
    allowOnly: [ElementTypes.FlipboxItem],
    maxChildren: 2
  },
  [ElementTypes.Timeline]: {
    allowOnly: [ElementTypes.TimelineTab],
    minChildren: 1
  },
  [ElementTypes.Table]: {
    allowOnly: [ElementTypes.TableHead, ElementTypes.TableBody]
  },
  [ElementTypes.TableHead]: {
    allowOnly: [ElementTypes.TableRow]
  },
  [ElementTypes.TableBody]: {
    allowOnly: [ElementTypes.TableRow]
  },
  [ElementTypes.TableRow]: {
    allowOnly: [ElementTypes.TableAside, ElementTypes.TableCol]
  }
};

/**
 * Elements that can ONLY be placed inside a specific parent type.
 * If an element is listed here and the resolved container doesn't match,
 * the operation is rejected with a helpful error message.
 */
const REQUIRED_PARENT: Record<string, string> = {
  [ElementTypes.TimelineTab]: ElementTypes.Timeline,
  [ElementTypes.SwitcherTab]: ElementTypes.Switcher,
  [ElementTypes.Column]: ElementTypes.Row
};

/**
 * Wrapper element types - used for cleanup when removing elements.
 * When removing an element inside these, check if wrapper becomes empty.
 */
const WRAPPER_ELEMENT_TYPES = [
  ElementTypes.Wrapper,
  ElementTypes.Wrapper2,
  ElementTypes.Cloneable
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Check if element type is a wrapper (for removal cleanup)
 */
export function isWrappersTypeElement(elementType: string): boolean {
  return WRAPPER_ELEMENT_TYPES.includes(elementType as ElementTypes);
}

/**
 * Check if element type is Column
 */
export function isColumnElement(elementType: string): boolean {
  return elementType === ElementTypes.Column;
}

/**
 * Check if element type is Row
 */
export function isRowElement(elementType: string): boolean {
  return elementType === ElementTypes.Row;
}

/**
 * Check if element type is TimelineTab
 */
export function isTimeLineTab(elementType: string): boolean {
  return elementType === ElementTypes.TimelineTab;
}

// ===========================================
// CONTAINER CORRECTION & VALIDATION
// ===========================================

/**
 * Result of container correction for element insertion
 */
export type ContainerCorrectionResult =
  | {
      success: true;
      container: ElementModelType2;
      path: string[];
    }
  | {
      success: false;
      error: string;
    };

/**
 * Correct and validate container for element insertion.
 *
 * Handles:
 * 1. Container redirects (Section → SectionItem, SectionHeader → SectionHeaderItem)
 * 2. Row → Column redirect for non-Column elements
 * 3. Element restrictions (Cloneable whitelist, Wrapper blacklist, Row whitelist)
 *
 * @param container - The target container
 * @param containerPath - The path to the container
 * @param elementType - The type of element being added
 * @returns Corrected container and path, or error message
 */
export function correctContainerForElement(
  container: ElementModelType2,
  containerPath: string[],
  elementType: string
): ContainerCorrectionResult {
  let current = container;
  let currentPath = containerPath;

  // Step 1: Redirect container to its first child (Section → SectionItem, Wrapper → child)
  // Skip redirect for direct children (e.g., SwitcherTab into Switcher stays at Switcher)
  const isDirectChild =
    CONTAINER_RESTRICTIONS[current.type]?.allowOnly?.includes(elementType) ??
    false;

  if (CONTAINER_REDIRECTS[current.type] && !isDirectChild) {
    const firstChild = getIn(
      current,
      FIRST_ITEM_PATH
    ) as MValue<ElementModelType2>;

    if (!firstChild) {
      return {
        success: false,
        error: `${current.type} has no children. Cannot add elements to an empty ${current.type}.`
      };
    }

    current = firstChild;
    currentPath = [...currentPath, ...FIRST_ITEM_PATH];
  }

  // Step 2: Row → Column redirect for non-Column elements
  if (isRowElement(current.type) && !isColumnElement(elementType)) {
    const firstColumn = getIn(
      current,
      FIRST_ITEM_PATH
    ) as MValue<ElementModelType2>;

    if (!firstColumn) {
      return {
        success: false,
        error: "Row has no columns. Add a Column first."
      };
    }

    current = firstColumn;
    currentPath = [...currentPath, ...FIRST_ITEM_PATH];
  }

  // Step 3: Check element restrictions for the final container
  const finalRestriction = CONTAINER_RESTRICTIONS[current.type];

  if (finalRestriction) {
    // Check whitelist (allowOnly)
    if (
      finalRestriction.allowOnly &&
      !finalRestriction.allowOnly.includes(elementType)
    ) {
      return {
        success: false,
        error: `${current.type} only accepts: ${finalRestriction.allowOnly.join(", ")}. Cannot add ${elementType}.`
      };
    }

    // Check blacklist (forbidden)
    if (finalRestriction.forbidden?.includes(elementType)) {
      return {
        success: false,
        error: `${elementType} cannot be nested inside ${current.type}.`
      };
    }

    // Check maxChildren limit
    if (finalRestriction.maxChildren !== undefined) {
      const currentChildren = current.value?.items?.length ?? 0;
      if (currentChildren >= finalRestriction.maxChildren) {
        return {
          success: false,
          error: `${current.type} can have maximum ${finalRestriction.maxChildren} children. Currently has ${currentChildren}.`
        };
      }
    }
  }

  // Step 4: Check if element requires a specific parent type
  const requiredParent = REQUIRED_PARENT[elementType];
  if (requiredParent && current.type !== requiredParent) {
    return {
      success: false,
      error: `${elementType} can ONLY be added inside a ${requiredParent}. The provided container is a ${current.type}. Use searchElements({type:'${requiredParent}'}) to find the correct container ID.`
    };
  }

  return {
    success: true,
    container: current,
    path: currentPath
  };
}

// ===========================================
// ELEMENT REMOVAL
// ===========================================

/**
 * Result of removing an element from a block
 */
export type RemoveElementFromBlockResult =
  | {
      success: true;
      updatedBlock: Block;
      removedElementId: string;
      finalPath: string[];
    }
  | {
      success: false;
      error: string;
    };

/**
 * Remove an element from a block and clean up any empty Wrapper/Cloneable containers.
 *
 * @param block - The block containing the element
 * @param relativePath - The path to the element within the block (without blockId)
 * @param elementId - The ID of the element being removed
 * @returns Updated block with element and empty wrappers removed, error, or undefined if removal failed
 */
export function removeElementFromBlock(
  block: Block,
  relativePath: string[],
  elementId: string
): MValue<RemoveElementFromBlockResult> {
  // Check minChildren before removal
  const parentPath = relativePath.slice(0, -3);

  if (parentPath.length > 0) {
    const parentBeforeRemoval = getIn(
      block,
      parentPath
    ) as MValue<ElementModelType2>;

    if (parentBeforeRemoval) {
      const restriction = CONTAINER_RESTRICTIONS[parentBeforeRemoval.type];

      if (restriction?.minChildren !== undefined) {
        const currentChildren = parentBeforeRemoval.value?.items?.length ?? 0;

        if (currentChildren <= restriction.minChildren) {
          return {
            success: false,
            error: `${parentBeforeRemoval.type} must have at least ${restriction.minChildren} child${restriction.minChildren === 1 ? "" : "ren"}. Currently has ${currentChildren}.`
          };
        }
      }
    }
  }

  // Remove the element
  let updatedBlock = removeIn(block, relativePath);

  if (!updatedBlock) {
    return undefined;
  }

  let removedElementId = elementId;
  let finalPath = relativePath;

  // After removal, check if parent Wrapper/Cloneable is now empty and should be removed
  const element = getIn(block, relativePath) as MValue<ElementModelType2>;

  if (parentPath.length > 0) {
    const parent = getIn(updatedBlock, parentPath) as MValue<ElementModelType2>;

    if (parent) {
      const { type, value } = parent;

      if (isWrappersTypeElement(type) && value.items?.length === 0) {
        // Remove the empty wrapper
        const wrapperRemoved = removeIn(updatedBlock, parentPath);

        if (wrapperRemoved) {
          updatedBlock = wrapperRemoved;
          removedElementId = parent.value?._id || elementId;
          finalPath = parentPath;
        }
      }

      // Needs to normalize columns widths after removed
      if (element && isColumnElement(element.type)) {
        const targetColumns =
          (getIn(parent, ["value", "items"]) as MValue<ElementModelType[]>) ??
          [];
        const updatedParent = setIn(
          parent,
          ["value", "items"],
          normalizeRowColumns(targetColumns)
        );

        updatedBlock = setIn(
          updatedBlock,
          parentPath,
          updatedParent
        ) as ElementModelType2;
      }
    }
  }

  return {
    success: true,
    updatedBlock: updatedBlock as Block,
    removedElementId,
    finalPath
  };
}

// ===========================================
// ELEMENT DUPLICATION
// ===========================================

/**
 * Result of duplicating an element within a block
 */
export interface DuplicateElementInBlockResult {
  updatedBlock: Block;
  newElementId: string;
  containerId: string;
  insertedAt: number;
}

/**
 * Duplicate an element within a block, inserting the clone next to the original.
 *
 * Handles:
 * - Wrapper/Wrapper2: clones the whole wrapper (structural unit in columns)
 * - Cloneable: clones just the element inside (Cloneable holds multiple items)
 * - Column: normalizes row column widths after duplication
 * - Other elements: clones directly
 *
 * @param block - The block containing the element
 * @param relativePath - The path to the element within the block (without blockId)
 * @param elementType - The type of the found element
 * @param insertAfter - Whether to insert after (true) or before (false) the original
 * @returns Updated block with duplicated element, or undefined if duplication failed
 */
export function duplicateElementInBlock(
  block: Block,
  relativePath: string[],
  elementType: string,
  insertAfter: boolean
): MValue<DuplicateElementInBlockResult> {
  const parentPath = relativePath.slice(0, -3);
  const elementIndex = parseInt(relativePath[relativePath.length - 1]);

  let cloneTargetPath: string[] = relativePath;
  let cloneTargetIndex: number = elementIndex;
  let itemsParentPath: string[];
  const toItems = ["value", "items"];

  if (parentPath.length > 0) {
    const parent = getNestedValue<ElementModelType2>(block, parentPath);

    if (parent && isWrappersTypeElement(parent.type)) {
      if (parent.type === ElementTypes.Cloneable) {
        // Clone element inside Cloneable (it holds multiple items)
        itemsParentPath = [...parentPath, ...toItems];
      } else {
        // Clone the whole Wrapper/Wrapper2 (structural unit)
        cloneTargetPath = parentPath;
        cloneTargetIndex = parseInt(parentPath[parentPath.length - 1]);
        const grandparentPath = parentPath.slice(0, -3);
        itemsParentPath = [...grandparentPath, ...toItems];
      }
    } else {
      itemsParentPath = [...parentPath, ...toItems];
    }
  } else {
    itemsParentPath = toItems;
  }

  // Get the element to clone
  const cloneTarget = getNestedValue(block, cloneTargetPath);
  if (!cloneTarget) {
    return undefined;
  }

  // Deep clone with new IDs
  const cloned = setIds(cloneTarget) as ElementModelType2;

  // Get the current items array
  const items =
    getNestedValue<ElementModelType2[]>(block, itemsParentPath) || [];

  // Determine insertion index
  const insertIndex = insertAfter ? cloneTargetIndex + 1 : cloneTargetIndex;

  // Create new items array with clone inserted
  const newItems = [
    ...items.slice(0, insertIndex),
    cloned,
    ...items.slice(insertIndex)
  ];

  // Update the block with new items
  let updatedBlock = setIn(block, itemsParentPath, newItems) as Block;

  // If duplicating a Column inside a Row, normalize column widths
  if (isColumnElement(elementType) && parentPath.length > 0) {
    const parent = getNestedValue<ElementModelType2>(updatedBlock, parentPath);
    if (parent && isRowElement(parent.type)) {
      const updatedColumns =
        getNestedValue<ElementModelType[]>(parent, ["value", "items"]) ?? [];

      const normalizedParent = setIn(
        parent,
        ["value", "items"],
        normalizeRowColumns(updatedColumns)
      );
      updatedBlock = setIn(updatedBlock, parentPath, normalizedParent) as Block;
    }
  }

  // Resolve container ID
  const containerParentPath = itemsParentPath.slice(0, -2);
  const container =
    containerParentPath.length > 0
      ? getNestedValue<ElementModelType2>(updatedBlock, containerParentPath)
      : updatedBlock;
  const containerId = (container?.value?._id || "") as string;

  return {
    updatedBlock,
    newElementId: cloned.value._id as string,
    containerId,
    insertedAt: insertIndex
  };
}

// ===========================================
// ELEMENT CREATION
// ===========================================

/**
 * Merges initial properties into an element's value
 */
function mergeInitialProperties(
  element: ElementModelType2,
  initialProperties: Record<string, unknown>
): ElementModelType2 {
  if (!initialProperties || Object.keys(initialProperties).length === 0) {
    return element;
  }

  const updatedValue = {
    ...element.value
  };

  for (const [key, value] of Object.entries(initialProperties)) {
    if (value === undefined) continue;
    updatedValue[key] = value;
  }

  return {
    ...element,
    value: updatedValue
  };
}

// specfic case if addButton, addIcon in Clonable
const getElement = (
  container: ElementModelType2,
  containerType: string
): ElementModelType2 => {
  if (isWrappersTypeElement(containerType)) {
    const element = getIn(
      container,
      FIRST_ITEM_PATH
    ) as MValue<ElementModelType2>;

    if (element) {
      return element;
    }
  }

  return container;
};

/**
 * Creates a default element from shortcodes
 */
export function createDefaultElement(
  elementType: string,
  containerType: string,
  config: ConfigCommon,
  initialProperties?: Record<string, unknown>
): MValue<ElementModelType2> {
  if (isColumnElement(elementType)) {
    const newColumn = createNewItem(ElementTypes.Column, {
      _styles: ["column"],
      items: []
    }) as ElementModelType2;
    return initialProperties
      ? mergeInitialProperties(newColumn, initialProperties)
      : newColumn;
  }

  if (isRowElement(elementType)) {
    const newRow = createNewItem(ElementTypes.Row, {
      _styles: ["row"],
      items: []
    }) as ElementModelType2;

    return initialProperties
      ? mergeInitialProperties(newRow, initialProperties)
      : newRow;
  }

  if (isTimeLineTab(elementType)) {
    const newColumn = createNewItem(ElementTypes.TimelineTab, {
      _styles: ["timelineTab"],
      items: []
    }) as ElementModelType2;
    return initialProperties
      ? mergeInitialProperties(newColumn, initialProperties)
      : newColumn;
  }

  const shortcodes = getSampleShortCodes(config);

  // Map AI element type to shortcode key
  const shortcodeKey = getShortcodeKey(elementType);

  if (!(shortcodeKey in shortcodes)) {
    return undefined;
  }

  const shortcode = shortcodes[shortcodeKey as keyof typeof shortcodes];

  if (!shortcode?.resolve) {
    return undefined;
  }

  const container = setIds(shortcode.resolve) as ElementModelType2;

  if (!initialProperties) {
    return getElement(container, containerType);
  }

  const element = getIn(
    container,
    FIRST_ITEM_PATH
  ) as MValue<ElementModelType2>;

  if (!element) {
    return mergeInitialProperties(container, initialProperties);
  }

  const newElement = mergeInitialProperties(element, initialProperties);
  const newContainer = setIn(
    container,
    FIRST_ITEM_PATH,
    newElement
  ) as ElementModelType2;

  return getElement(newContainer, containerType);
}

/**
 * Gets nested value from an object using a path
 */
export function getNestedValue<T>(
  obj: Block | ElementModelType2,
  path: string[]
): MValue<T> {
  return getIn(obj, path) as MValue<T>;
}

// ===========================================
// COLUMN WIDTH UPDATE
// ===========================================

/**
 * Result of updating a column within a row
 */
export type UpdateColumnInRowResult =
  | { success: true; updatedBlock: Block }
  | { success: false; error: string };

/**
 * Update a column within a block, redistributing sibling column widths when width changes.
 *
 * When width is changed on one column:
 * - The target column keeps the requested width
 * - The remaining width (100 - targetWidth) is distributed equally among siblings
 *   using the same logic as `normalizeRowColumns`
 *
 * For non-width changes (bg color, padding, etc.), the column is updated directly.
 */
export function updateColumnInRow(
  block: Block,
  relativePath: string[],
  column: ElementModelType2,
  changes: Record<string, unknown>
): UpdateColumnInRowResult {
  // Merge changes into column value
  const updatedValue = { ...column.value, ...changes };
  const updatedColumn = { ...column, value: updatedValue };

  // Update the column in the block
  let updatedBlock = setIn(block, relativePath, updatedColumn) as Block;

  // If width was changed, recalculate sibling columns
  if ("width" in changes && changes.width !== undefined) {
    // Parent Row is 3 path segments up: ["value", "items", columnIndex]
    const parentPath = relativePath.slice(0, -3);

    if (parentPath.length > 0) {
      const parentRow = getIn(
        updatedBlock,
        parentPath
      ) as MValue<ElementModelType2>;

      if (parentRow && isRowElement(parentRow.type)) {
        const columns =
          (parentRow.value?.items as ElementModelType[] | undefined) || [];
        const columnIndex = parseInt(relativePath[relativePath.length - 1]);

        const result = redistributeColumnWidths(
          columns,
          columnIndex,
          changes.width as number
        );

        if (!result.success) {
          return result;
        }

        if (result.columns) {
          const updatedParent = setIn(
            parentRow,
            ["value", "items"],
            result.columns
          );
          updatedBlock = setIn(
            updatedBlock,
            parentPath,
            updatedParent
          ) as Block;
        }
      }
    }
  }

  return { success: true, updatedBlock };
}

const ROW_WIDTH = 100;
const MIN_COLUMN_WIDTH_PERCENT = 5;
const truncate = (num: number) => Number(num.toFixed(1));

type RedistributeResult =
  | { success: true; columns: ElementModelType[] | undefined }
  | { success: false; error: string };

/**
 * Redistribute column widths in a Row after one column's width changes.
 * The target column keeps its requested width; the remaining width
 * is distributed equally among siblings (same logic as normalizeRowColumns).
 *
 * Validates that no column (target or sibling) goes below MIN_COLUMN_WIDTH_PERCENT.
 */
function redistributeColumnWidths(
  columns: ElementModelType[],
  targetIndex: number,
  targetWidth: number
): RedistributeResult {
  const siblingCount = columns.length - 1;

  if (siblingCount <= 0) return { success: true, columns: undefined };

  // Validate target column width
  if (targetWidth < MIN_COLUMN_WIDTH_PERCENT) {
    return {
      success: false,
      error: `Column width ${targetWidth}% is below the minimum of ${MIN_COLUMN_WIDTH_PERCENT}%.`
    };
  }

  const remainingWidth = ROW_WIDTH - targetWidth;
  const perSibling = truncate(remainingWidth / siblingCount);

  // Validate that siblings won't go below minimum
  if (perSibling < MIN_COLUMN_WIDTH_PERCENT) {
    const maxAllowed = ROW_WIDTH - siblingCount * MIN_COLUMN_WIDTH_PERCENT;
    return {
      success: false,
      error: `Column width ${targetWidth}% is too large. The remaining ${siblingCount} column(s) would each get ${perSibling}%, which is below the minimum of ${MIN_COLUMN_WIDTH_PERCENT}%. Maximum allowed width for this column is ${maxAllowed}%.`
    };
  }

  const lastSibling = truncate(
    remainingWidth - perSibling * (siblingCount - 1)
  );

  let siblingIdx = 0;
  const result = columns.map((col, i) => {
    if (i === targetIndex) return col;
    const width = ++siblingIdx === siblingCount ? lastSibling : perSibling;
    return setIn(col, ["value", "width"], width) as ElementModelType;
  });

  return { success: true, columns: result };
}

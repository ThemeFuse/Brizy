import type { ElementModelType2 } from "visual/component/Elements/Types";
import { FromTo } from "visual/editorComponents/Page/utils/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import {
  getNestedValue,
  isColumnElement,
  isRowElement,
  isWrappersTypeElement
} from "./element";

type DndContainerType = "column" | "row" | "section" | "thirdPartyContainer";

/**
 * Maps element type to DND container type
 */
export function mapToDndContainerType(containerType: string): DndContainerType {
  switch (containerType) {
    case ElementTypes.SectionItem:
    case ElementTypes.SectionHeaderItem:
    case ElementTypes.SectionFooter:
      return "section";
    case ElementTypes.Row:
      return "row";
    case "thirdPartyContainer":
      return "thirdPartyContainer";
    default:
      return "column";
  }
}

/**
 * Builds the FromTo object for adding elements via DND
 */
export function buildAddableFromTo(
  itemData: ElementModelType2,
  containerType: "column" | "row" | "section" | "thirdPartyContainer",
  itemPath: string[],
  containerPath: string[]
): FromTo {
  const from = {
    itemType: "addable" as const,
    itemData
  };

  switch (containerType) {
    case "row":
      return {
        from,
        to: {
          containerType: "row",
          containerPath:
            containerPath.length > 0
              ? [...containerPath, "value", "items"]
              : ["value", "items"],
          itemPath
        }
      };
    case "section":
      return {
        from,
        to: {
          containerType: "section",
          itemPath
        }
      };
    case "thirdPartyContainer":
      return {
        from,
        to: {
          containerType: "thirdPartyContainer",
          containerPath:
            containerPath.length > 0
              ? [...containerPath, "value", "items"]
              : ["value", "items"],
          itemPath
        }
      };
    case "column":
    default:
      return {
        from,
        to: {
          containerType: "column",
          itemPath
        }
      };
  }
}

interface MoveToParams {
  toContainerType: DndContainerType;
  toItemPath: string[];
  toContainerPath: string[];
  targetIndex: number;
}

function fromRow(
  block: Block,
  sourceRelativePath: string[],
  to: MoveToParams
): FromTo {
  const sourceParentPath = sourceRelativePath.slice(0, -3);
  const parent =
    sourceParentPath.length > 0
      ? getNestedValue<ElementModelType2>(block, sourceParentPath)
      : (block as unknown as ElementModelType2);
  const parentId = parent?.value?._id as string;
  const sourceIndex = sourceRelativePath[sourceRelativePath.length - 1];

  return {
    from: {
      itemType: "row",
      itemPath: [parentId, "items", sourceIndex]
    },
    to: {
      containerType: to.toContainerType as
        | "column"
        | "section"
        | "thirdPartyContainer",
      itemPath: to.toItemPath
    }
  };
}

function fromColumn(
  block: Block,
  sourceRelativePath: string[],
  to: MoveToParams
): FromTo {
  const sourceParentPath = sourceRelativePath.slice(0, -3);
  const parent =
    sourceParentPath.length > 0
      ? getNestedValue<ElementModelType2>(block, sourceParentPath)
      : (block as unknown as ElementModelType2);
  const parentId = parent?.value?._id as string;
  const sourceIndex = sourceRelativePath[sourceRelativePath.length - 1];
  const fromContainerType = mapToDndContainerType(parent?.type || "");

  const from = {
    itemType: "column" as const,
    itemPath: [parentId, "items", sourceIndex],
    containerPath: [parentId, "items"],
    containerType: fromContainerType
  };

  switch (to.toContainerType) {
    case "row":
      return {
        from,
        to: {
          containerType: "row",
          itemPath: to.toItemPath,
          containerPath: to.toContainerPath
        }
      };
    case "section":
      return {
        from,
        to: {
          containerType: "section",
          itemPath: to.toItemPath
        }
      };
    case "thirdPartyContainer":
      return {
        from,
        to: {
          containerType: "thirdPartyContainer",
          itemPath: to.toItemPath,
          containerPath: to.toContainerPath
        }
      };
    default:
      return {
        from,
        to: {
          containerType: "column",
          itemPath: to.toItemPath
        }
      };
  }
}

function fromShortcode(
  block: Block,
  sourceRelativePath: string[],
  to: MoveToParams
): FromTo {
  const sourceParentPath = sourceRelativePath.slice(0, -3);

  let fromContainerId: string = block.value._id as string;
  let fromItemIndex: string = sourceRelativePath[sourceRelativePath.length - 1];
  let fromContainerType: string = mapToDndContainerType(block.type);

  if (sourceParentPath.length > 0) {
    const parent = getNestedValue<ElementModelType2>(block, sourceParentPath);

    if (parent && isWrappersTypeElement(parent.type)) {
      if (parent.type === ElementTypes.Cloneable) {
        // Cloneable: container is the Cloneable, containerType = "cloneable"
        fromContainerId = parent.value._id as string;
        fromContainerType = "cloneable";
      } else {
        // Wrapper/Wrapper2: movable unit is the Wrapper
        // Container is the Wrapper's parent (e.g., Column)
        const wrapperParentPath = sourceParentPath.slice(0, -3);
        const wrapperParent = getNestedValue<ElementModelType2>(
          block,
          wrapperParentPath
        );

        fromContainerId = wrapperParent?.value?._id as string;
        fromItemIndex = sourceParentPath[sourceParentPath.length - 1];
        fromContainerType = mapToDndContainerType(wrapperParent?.type || "");
      }
    } else {
      // Regular element, parent is the container
      fromContainerId = parent?.value?._id as string;
      fromContainerType = mapToDndContainerType(parent?.type || "");
    }
  }

  const from = {
    itemType: "shortcode" as const,
    itemIndex: parseInt(fromItemIndex),
    itemPath: [fromContainerId, "items", fromItemIndex],
    containerPath: [fromContainerId, "items"],
    containerType: fromContainerType
  };

  return {
    from,
    to: {
      containerType: to.toContainerType,
      itemPath: to.toItemPath,
      containerPath: to.toContainerPath,
      itemIndex: to.targetIndex
    }
  } as FromTo;
}

/**
 * Build proper FromTo for element moves using UID-based paths.
 *
 * Paths use the format [elementId, "items", index] which normalizeFromTo
 * resolves to full model paths via createFullModelPath.
 *
 * Determines the movable unit:
 * - Wrapper/Wrapper2 parent -> moves the whole wrapper
 * - Cloneable parent -> containerType = "cloneable"
 * - Column -> itemType = "column"
 * - Row -> itemType = "row"
 * - Other -> itemType = "shortcode"
 */
export function buildMoveFromTo(
  block: Block,
  sourceElement: ElementModelType2,
  sourceRelativePath: string[],
  targetContainer: ElementModelType2,
  targetIndex: number
): FromTo {
  const targetId = targetContainer.value._id as string;
  const to: MoveToParams = {
    toContainerType: mapToDndContainerType(targetContainer.type),
    toItemPath: [targetId, "items", `${targetIndex}`],
    toContainerPath: [targetId, "items"],
    targetIndex
  };

  if (isRowElement(sourceElement.type)) {
    return fromRow(block, sourceRelativePath, to);
  }

  if (isColumnElement(sourceElement.type)) {
    return fromColumn(block, sourceRelativePath, to);
  }

  return fromShortcode(block, sourceRelativePath, to);
}

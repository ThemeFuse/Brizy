import { isEqual } from "es-toolkit";
import { Draft, produce } from "immer";
import { ElementModelType2 } from "visual/component/Elements/Types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateGlobalBlock } from "visual/redux/actions2";
import { Block } from "visual/types/Block";
import { findDeep } from "visual/utils/object";
import { modelTraverse } from "visual/utils/traverse/model";
import { TreeItem, TreeItems } from "./types";

export function setAll<T extends keyof TreeItem>(
  items: TreeItems,
  property: T,
  value: TreeItem[T]
): TreeItems {
  return items.map((item) => ({
    ...item,
    [property]: value,
    children:
      item.children && item.children.length
        ? setAll(item.children, property, value)
        : null
  }));
}

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: string,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
): TreeItems {
  return items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        [property]: setter(item[property])
      };
    }
    if (item.children && item.children.length) {
      return {
        ...item,
        children: setProperty(item.children, id, property, setter)
      };
    }
    return item;
  });
}

export const WRAPPER_TYPES: Set<string> = new Set([
  ElementTypes.Row,
  ElementTypes.Column,
  ElementTypes.Wrapper,
  ElementTypes.Cloneable,
  ElementTypes.StoryWrapper,
  ElementTypes.Section,
  ElementTypes.SectionHeader,
  ElementTypes.SectionFooter,
  ElementTypes.SectionMegaMenu,
  ElementTypes.StoryItem
]);

const CLONEABLE_ITEMS: string[] = [ElementTypes.Button, ElementTypes.Icon];

export const CUSTOM_ID_TYPES: Set<string> = new Set([
  ElementTypes.Row,
  ElementTypes.Column,
  ElementTypes.Button,
  ElementTypes.Icon,
  ElementTypes.Wrapper,
  ElementTypes.StoryWrapper,
  ElementTypes.Cloneable,
  ElementTypes.Form2Field,
  ElementTypes.Section,
  ElementTypes.Leadific
]);

export function supportsCustomId(type: string): boolean {
  return CUSTOM_ID_TYPES.has(type);
}

export function supportsShowOnDevice(type: string): boolean {
  return WRAPPER_TYPES.has(type) || CLONEABLE_ITEMS.includes(type);
}

export function setHiddenElement(
  items: ElementModelType2[],
  id: string
): ElementModelType2[] {
  return produce(items, (draft) => {
    walk(draft, [], id);
  });
}

const walk = (
  arr: Draft<ElementModelType2[]>,
  parents: ElementModelType2[],
  id: string
): boolean => {
  for (const item of arr) {
    if (item.value._id === id) {
      // Decide target: self if supports, otherwise nearest parent that supports
      const target = supportsShowOnDevice(item.type)
        ? item
        : ([...parents].reverse().find((p) => supportsShowOnDevice(p.type)) ??
          item);

      toggleFor(target);
      return true;
    }

    if (item.value.items && item.value.items.length) {
      const found = walk(
        item.value.items as Draft<ElementModelType2[]>,
        [...parents, item],
        id
      );
      if (found) return true;
    }
  }
  return false;
};

const toggleFor = (el: ElementModelType2) => {
  const current = el.value.showOnDesktop ?? "on";
  const newValue = current === "off" ? "on" : "off";
  el.value.showOnDesktop = newValue;
  el.value.showOnTablet = newValue;
  el.value.showOnMobile = newValue;
};

type StackItem = { node: Block; closestWrapperId: string | null };

export const getCurrentWrapperElementId = (
  items: Block[],
  targetId: string
): string | null => {
  const stack: StackItem[] = items.map((node) => ({
    node,
    closestWrapperId: WRAPPER_TYPES.has(node.type) ? node.value._id : null
  }));

  while (stack.length > 0) {
    const { node, closestWrapperId } = stack.pop() ?? {
      closestWrapperId: null
    };
    if (!node) {
      continue;
    }

    const { _id, items } = node.value;

    // If node is target and a wrapper, return it
    if (_id === targetId && WRAPPER_TYPES.has(node.type)) {
      return _id;
    }

    // If node is target but not a wrapper, return closest wrapper
    if (_id === targetId && closestWrapperId) {
      return closestWrapperId;
    }

    if (Array.isArray(items)) {
      // Push items onto the stack
      for (const item of items) {
        stack.push({
          node: item,
          closestWrapperId: WRAPPER_TYPES.has(item.type)
            ? item.value._id
            : closestWrapperId
        });
      }
    }
  }

  return null;
};

const shouldRemoveContainer = (block: Block, id: string): boolean => {
  const wrapperTypes: string[] = [
    ElementTypes.Row,
    ElementTypes.Cloneable,
    ElementTypes.Wrapper,
    ElementTypes.StoryWrapper,
    ElementTypes.Wrapper2
  ];

  const isTarget = block.value._id === id;

  if (isTarget) {
    return true;
  }

  if (wrapperTypes.includes(block.type)) {
    return block.value.items.length === 0;
  }
  return false;
};

export function removeBlockWithWrapper(blocks: Block[], id: string): Block[] {
  return produce(blocks, (draft) => {
    // Define behaviors for different block types
    const conditions = {
      Component: (block: Block) => {
        // If this block matches ID, remove it
        if (block.value._id === id) {
          removeBlockFromParent(draft, block);
        }
      },
      [ElementTypes.Row]: (block: Block) => {
        if (block.value.items?.length) {
          block.value.items = block.value.items.filter((child: Block) => {
            if (child.value._id === id) return false;
            return true;
          });

          // Clean up if empty or recalc columns
          const shouldRemove = shouldRemoveContainer(block, id);
          if (shouldRemove) {
            removeBlockFromParent(draft, block);
          } else {
            block.value.items = recalculateColumnWidths(block.value.items);
          }
        }
      },
      [ElementTypes.Wrapper]: (block: Block) => {
        if (block.value._id === id || shouldRemoveContainer(block, id)) {
          removeBlockFromParent(draft, block);
        }
      },
      [ElementTypes.StoryWrapper]: (block: Block) => {
        if (block.value._id === id || shouldRemoveContainer(block, id)) {
          removeBlockFromParent(draft, block);
        }
      },
      [ElementTypes.Wrapper2]: (block: Block) => {
        if (block.value._id === id || shouldRemoveContainer(block, id)) {
          removeBlockFromParent(draft, block);
        }
      },
      [ElementTypes.Cloneable]: (block: Block) => {
        if (shouldRemoveContainer(block, id)) {
          removeBlockFromParent(draft, block);
        }
      }
    };

    modelTraverse(draft, conditions);
  });
}

// Utility to remove a block from its parent (mutates safely inside immer)
export function removeBlockFromParent(root: Block[], target: Block): boolean {
  const remove = (items: Block[]): boolean => {
    const index = items.findIndex((b) => b.value._id === target.value._id);
    if (index !== -1) {
      items.splice(index, 1);
      return true;
    }
    for (const b of items) {
      if (Array.isArray(b?.value?.items) && remove(b.value.items)) {
        return true;
      }
    }
    return false;
  };

  return remove(root);
}

export const recalculateColumnWidths = (columns: Block[]): Block[] => {
  if (columns.length === 0) return columns;

  const equalWidth = Math.floor(100 / columns.length);
  const remainder = 100 - equalWidth * columns.length;

  return columns.map((column, index) => {
    const width = equalWidth + (index < remainder ? 1 : 0);
    return {
      ...column,
      value: {
        ...column.value,
        width
      }
    };
  });
};

export function checkForGlobalBlockChanges(
  newBlocks: Block[],
  globalBlockIds: string[],
  currentId: string,
  originalBlocks?: Block[]
): Block | null {
  // First, check the new position of the dragged element
  const { obj: foundBlock, path } = findDeep(newBlocks, (obj: Block) => {
    const id = obj.value?._id;
    return id === currentId;
  });

  if (foundBlock && path) {
    // Check if the found block is itself a global block
    if (globalBlockIds.includes(foundBlock.value._id)) {
      return foundBlock;
    }

    const parent = newBlocks[path[0]];
    if (parent && parent.value && globalBlockIds.includes(parent.value._id)) {
      return parent;
    }
  }

  // If not found in new position or not in a global block, check the original position
  // This handles the case where an element was moved from a global block to a non-global block
  if (originalBlocks) {
    const { obj: originalFoundBlock, path: originalPath } = findDeep(
      originalBlocks,
      (obj: Block) => {
        const id = obj.value?._id;
        return id === currentId;
      }
    );

    if (originalFoundBlock && originalPath) {
      // Check if the original block was itself a global block
      const path = originalPath[0]; // The global block is always at the top level
      const block = newBlocks[path];
      const id = block?.value?._id;
      if (globalBlockIds.includes(id)) {
        return block;
      }
    }
  }

  return null;
}

export function updateGlobalBlocksOnChange(
  affectedGlobalBlock: Block,
  globalBlocks: Record<string, { data: { value: Block["value"] } }>,
  config: ConfigCommon,
  dispatch: (action: ReturnType<typeof updateGlobalBlock>) => void
): void {
  const { _id } = affectedGlobalBlock.value;
  const gbDBValue = globalBlocks[_id].data.value;

  const updatedGlobalBlockData = {
    ...globalBlocks[_id].data,
    value: {
      ...gbDBValue,
      ...affectedGlobalBlock.value
    }
  } as Block;

  if (isEqual(updatedGlobalBlockData.value, gbDBValue)) return;

  dispatch(
    updateGlobalBlock({
      uid: _id,
      data: updatedGlobalBlockData,
      config,
      meta: { is_autosave: 1, sourceBlockId: _id }
    })
  );
}

export function makeBlock(
  id: string,
  type: string,
  children?: Block[],
  extra?: Record<string, unknown>
): Block {
  return {
    type,
    value: {
      _id: id,
      ...(children ? { items: children } : {}),
      ...extra
    }
  } as Block;
}

export const isBlockLevel = (type: string): boolean => {
  return [
    ElementTypes.Section,
    ElementTypes.SectionHeader,
    ElementTypes.SectionFooter,
    ElementTypes.SectionMegaMenu,
    ElementTypes.SectionPopup,
    ElementTypes.SectionPopup2
  ].includes(type as ElementTypes);
};

type UpdateTarget = {
  block: Block;
  property: "anchorName" | "customID";
};

const findUpdateTargetForTitle = (
  blocks: Block[],
  id: string,
  parent: Block | null = null
): UpdateTarget | null => {
  for (const block of blocks) {
    if (block.value._id === id) {
      // If block level, update anchorName
      if (isBlockLevel(block.type)) {
        return { block, property: "anchorName" };
      }

      // If block supports customID, update it
      if (supportsCustomId(block.type)) {
        return { block, property: "customID" };
      }

      // If parent supports customID, update parent
      if (parent && supportsCustomId(parent.type)) {
        return { block: parent, property: "customID" };
      }

      return null;
    }

    if (Array.isArray(block.value.items)) {
      const result = findUpdateTargetForTitle(block.value.items, id, block);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const updateBlockInDraftForTitle = (
  draft: Draft<Block[]>,
  targetId: string,
  property: "anchorName" | "customID",
  value: string
): boolean => {
  for (const block of draft) {
    if (block.value._id === targetId) {
      block.value[property] = value;
      return true;
    }

    if (Array.isArray(block.value.items)) {
      if (
        updateBlockInDraftForTitle(
          block.value.items as Draft<Block[]>,
          targetId,
          property,
          value
        )
      ) {
        return true;
      }
    }
  }
  return false;
};

export function updateBlockTitle(
  blocks: Block[],
  id: string,
  title: string
): Block[] {
  const target = findUpdateTargetForTitle(blocks, id);

  if (!target) {
    return blocks;
  }

  return produce(blocks, (draft) => {
    updateBlockInDraftForTitle(
      draft,
      target.block.value._id,
      target.property,
      title
    );
  });
}

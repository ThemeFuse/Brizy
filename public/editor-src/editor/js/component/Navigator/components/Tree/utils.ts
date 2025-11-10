import { arrayMove } from "@dnd-kit/sortable";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TreeItem, TreeItems } from "visual/providers/TreeProvider/types";
import {
  WRAPPER_TYPES,
  recalculateColumnWidths
} from "visual/providers/TreeProvider/utils";
import { Block } from "visual/types/Block";
import { findDeep } from "visual/utils/object";
import { uuid } from "visual/utils/uuid";

export interface FlattenedItem extends TreeItem {
  parentId: string | null;
  depth: number;
  index: number;
}

export const SPACING_SIZE = 12;

export const SECTION_TYPES = new Set<string>([
  ElementTypes.Section,
  ElementTypes.SectionHeader,
  ElementTypes.SectionFooter,
  ElementTypes.SectionPopup,
  ElementTypes.SectionPopup2,
  ElementTypes.Story
]);

export const CONTAINERS_LIKE_PARENTS = new Set<string>([
  ElementTypes.Row,
  ElementTypes.Column,
  ElementTypes.AccordionItem,
  ElementTypes.Tab,
  ElementTypes.FlipboxItem,
  ElementTypes.SwitcherTab,
  ElementTypes.SectionItem,
  ElementTypes.SectionHeaderItem,
  ElementTypes.SectionHeaderStickyItem,
  ElementTypes.StoryItem
]);

// Child container types that require a specific wrapper parent
const REQUIRED_PARENT_BY_CHILD = new Map<string, string>([
  [ElementTypes.AccordionItem, ElementTypes.Accordion],
  [ElementTypes.SwitcherTab, ElementTypes.Switcher],
  [ElementTypes.FlipboxItem, ElementTypes.Flipbox],
  [ElementTypes.Tab, ElementTypes.Tabs],
  [ElementTypes.SectionItem, ElementTypes.Section],
  [ElementTypes.SectionHeaderItem, ElementTypes.SectionHeader],
  [ElementTypes.SectionHeaderStickyItem, ElementTypes.SectionHeader],
  [ElementTypes.StoryItem, ElementTypes.Story]
]);

export function flattenTree(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flattenTree(item.children ?? [], item.id, depth + 1)
    ];
  }, []);
}

// Flatten for rendering/DnD, respecting item.visible === false by skipping the node
// but keeping its children at the same depth and with the same parentId
export function flattenForRender(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const isVisible = item.visible !== false;
    if (isVisible) {
      acc.push({ ...item, parentId, depth, index });
      acc.push(...flattenForRender(item.children ?? [], item.id, depth + 1));
    } else {
      // Skip the current node, but keep its children at the same depth and parent
      acc.push(...flattenForRender(item.children ?? [], parentId, depth));
    }
    return acc;
  }, []);
}

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: string[]
): FlattenedItem[] {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children?.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

export const findItemDeep = (
  items: TreeItems,
  itemId: string
): TreeItem | undefined =>
  findDeep(items, (item: TreeItem) => item.id === itemId).obj;

const countChildren = (items: TreeItem[], count = 0): number =>
  items.reduce((acc, { children, visible }) => {
    const count = visible ? acc + 1 : acc;
    if (children?.length) {
      return countChildren(children, count);
    }

    return count;
  }, count);

export function getChildCount(items: TreeItems, id: string): number {
  const item = findItemDeep(items, id);

  return item && item.children ? countChildren(item.children) : 0;
}

export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number
): {
  depth: number;
  maxDepth: number;
  minDepth: number;
  parentId: string | null;
} {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = Math.round(dragOffset / SPACING_SIZE);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = previousItem ? previousItem.depth + 1 : 0;
  const minDepth = nextItem ? nextItem.depth : 0;
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = {
    id: "root",
    children: [],
    type: "",
    title: "",
    icon: null,
    isHidden: false
  };

  const nodes: Record<string, TreeItem> = { [root.id]: root };

  // initialize items with children = null
  const items: FlattenedItem[] = flattenedItems.map((item) => ({
    ...item,
    children: null
  }));

  for (const item of items) {
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? items.find(({ id }) => id === parentId);

    nodes[item.id] = item;

    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(item);

    if (CONTAINERS_LIKE_PARENTS.has(item.type) && item.children === null) {
      item.children = [];
    }
  }

  return root.children ?? [];
}

export const isValidParentForChild = (
  parentType: string | null,
  childType: string
): boolean => {
  if (parentType === null) {
    // Root level: only sections allowed
    return SECTION_TYPES.has(childType);
  }

  // Enforce specific wrapper relationships (except Row/Column which are handled below)
  const requiredParent = REQUIRED_PARENT_BY_CHILD.get(childType);
  if (requiredParent) {
    return parentType === requiredParent;
  }

  if (parentType === ElementTypes.Story) {
    // Story can only contain StoryItem elements
    return childType === ElementTypes.StoryItem;
  }

  if (SECTION_TYPES.has(parentType)) {
    // Sections can contain containers (Row/Column) and simple items, but not other Sections
    return !SECTION_TYPES.has(childType);
  }

  const columnParents: string[] = [ElementTypes.Row, ElementTypes.Carousel];
  if (columnParents.includes(parentType)) {
    // Rows can only contain Columns
    return childType === ElementTypes.Column;
  }

  if (parentType === ElementTypes.Column) {
    // Columns can contain containers and simple items, but not Sections
    return !SECTION_TYPES.has(childType);
  }

  if (CONTAINERS_LIKE_PARENTS.has(parentType)) {
    // Allow non-Section items under container-like parents (including Row/Column and simple items)
    return !SECTION_TYPES.has(childType);
  }

  // Other items cannot contain children
  return false;
};

export function treeToBlocks(
  tree: TreeItems,
  parentId?: string,
  newElementId?: string
): Block[] {
  return tree.map((node) => {
    const block: Block = {
      type: node.type,
      value: {
        _id: node.id,
        ...(node.children
          ? { items: treeToBlocks(node.children, node.id, newElementId) }
          : {})
      }
    } as Block;

    // Add Row-specific styles for Row wrappers created for columns
    if (node.type === ElementTypes.Row && node.id === newElementId) {
      block.value._styles = ["row", "hide-row-borders", "padding-0"];
    }

    if (parentId === newElementId && node.type === ElementTypes.Column) {
      // For columns in new rows, we need to preserve original values and only update width
      block.value._preserveOriginal = true;
      block.value.width = 100;
    }

    return block;
  });
}

export function mergeBlocks(original: Block[], tree: Block[]): Block[] {
  const byId = new Map<string, Block>();

  const stack = [...(original || [])];
  while (stack.length) {
    const b = stack.pop();
    if (!b) continue;
    byId.set(b.value._id, b);
    if (Array.isArray(b.value.items)) {
      stack.push(...b.value.items);
    }
  }

  const mergedBlocks = tree.map((t) => mergeNode(t, byId));

  // Remove empty containers after merge
  return removeEmptyContainers(mergedBlocks);
}

export function removeEmptyContainers(blocks: Block[]): Block[] {
  return blocks.filter((block) => {
    if (Array.isArray(block.value.items)) {
      // Recursively remove empty containers from children
      block.value.items = removeEmptyContainers(block.value.items);

      // Check if this container should be removed
      const wrapperTypes: string[] = [
        ElementTypes.Row,
        ElementTypes.Cloneable,
        ElementTypes.Wrapper
      ];

      if (wrapperTypes.includes(block.type) && block.value.items.length === 0) {
        return false;
      }
    }
    return true;
  });
}

const mergeNode = (t: Block, byId: Map<string, Block>): Block => {
  const orig = byId.get(t.value._id);

  // Merge children first to get the correct references/order
  const newChildren = Array.isArray(t.value.items)
    ? (t.value.items as Block[]).map((t) => mergeNode(t, byId))
    : undefined;

  if (!orig) {
    // No original: build a fresh node with merged children
    return {
      ...t,
      value: {
        ...t.value,
        ...(newChildren !== undefined ? { items: newChildren } : {})
      }
    };
  }

  // Decide children reference: reuse if identical by reference
  const origChildren = Array.isArray(orig.value.items)
    ? (orig.value.items as Block[])
    : undefined;

  let itemsRef = newChildren !== undefined ? newChildren : undefined;
  if (
    origChildren &&
    itemsRef &&
    origChildren.length === itemsRef.length &&
    origChildren.every((c, i) => c === itemsRef?.[i])
  ) {
    // Reuse original array reference if element-wise identical
    itemsRef = origChildren;
  }

  // Build next value, preserving other properties from original
  let nextValue: Block["value"];
  if (itemsRef === origChildren) {
    nextValue = orig.value;
  } else {
    const base = { ...orig.value, ...t.value };
    if (itemsRef !== undefined) {
      // Check if this is a Row and we need to recalculate column widths
      if (
        t.type === ElementTypes.Row &&
        itemsRef.length !== origChildren?.length
      ) {
        itemsRef = recalculateColumnWidths(itemsRef);
      }
      nextValue = { ...base, items: itemsRef };
    } else {
      // Explicitly remove items when the new node has no children
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items, ...rest } = base;
      nextValue = rest;
    }
  }

  // Handle new values that should override original values
  if (t.value._isNewValue) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _isNewValue, ...newValueProps } = t.value;
    nextValue = { ...nextValue, ...newValueProps };
  }

  // Handle values that should preserve original but override specific properties
  if (t.value._preserveOriginal && orig) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _preserveOriginal, items, ...overrideProps } = t.value;
    // Start with original values and only apply the specific overrides (excluding items)
    nextValue = { ...orig.value, ...overrideProps };
    // Use the processed children from the merge logic above
    if (itemsRef !== undefined) {
      nextValue = { ...nextValue, items: itemsRef };
    }
  }

  // If nothing changed at this node, return the original block to preserve identity
  if (nextValue === orig.value && orig.type === t.type) {
    return orig;
  }

  // Otherwise create a shallow new block, preserving other fields from original
  return {
    ...orig,
    type: t.type,
    value: nextValue
  };
};

export function findFlatById(
  map: Map<string, FlattenedItem>,
  id: string | null
): FlattenedItem | null {
  return id ? (map.get(id) ?? null) : null;
}

export function resolveMoveNode(
  source: FlattenedItem,
  allById: Map<string, FlattenedItem>
): FlattenedItem {
  const isContainer = (n: FlattenedItem | null) =>
    !!n &&
    (WRAPPER_TYPES.has(n.type) ||
      SECTION_TYPES.has(n.type) ||
      CONTAINERS_LIKE_PARENTS.has(n.type));

  if (WRAPPER_TYPES.has(source.type)) return source;

  // Special handling for Cloneable
  const parent = findFlatById(allById, source.parentId);
  if (parent && parent.type === ElementTypes.Cloneable) {
    // Get all siblings in the Cloneable
    const siblings = allById.get(parent.id)?.children || [];
    const siblingCount = siblings.length;

    if (siblingCount === 1) {
      // Only one item: drag the Cloneable container
      return parent;
    } else {
      // Multiple items: drag the individual item (will be handled by special case)
      return source;
    }
  }

  let node: FlattenedItem | null = findFlatById(allById, source.parentId);
  while (node && !isContainer(node)) {
    node = findFlatById(allById, node.parentId);
  }
  return node ?? source;
}

export function normalizeSectionParent(
  parentId: string | null,
  allById: Map<string, FlattenedItem>
): { parentId: string | null; depth?: number } {
  const parent = findFlatById(allById, parentId);
  if (parent && parent.type === ElementTypes.Section) {
    // children should go under SectionItem
    const sectionItem = [...allById.values()].find(
      (n) => n.parentId === parent.id && n.type === ElementTypes.SectionItem
    );
    if (sectionItem) {
      return { parentId: sectionItem.id, depth: sectionItem.depth + 1 };
    }
  }
  return { parentId };
}

export function validatePlacement(
  items: TreeItem[],
  parentId: string | null,
  moveNodeType: string
): boolean {
  let parentType: string | null = parentId
    ? (findItemDeep(items, parentId)?.type ?? null)
    : null;
  if (parentType === ElementTypes.SectionItem)
    parentType = ElementTypes.Section;
  if (parentType === ElementTypes.SectionHeaderItem)
    parentType = ElementTypes.SectionHeader;
  if (SECTION_TYPES.has(moveNodeType) && parentType !== null) return false;

  // Special validation for Story: only StoryItem can be nested inside Story
  if (
    parentType === ElementTypes.Story &&
    moveNodeType !== ElementTypes.StoryItem
  ) {
    return false;
  }

  return isValidParentForChild(parentType, moveNodeType);
}

export function isDescendantOf(
  allById: Map<string, FlattenedItem>,
  ancestorId: string,
  candidateId: string | null
): boolean {
  if (!candidateId) return false;
  let node = candidateId ? (allById.get(candidateId) ?? null) : null;
  while (node) {
    if (node.parentId === ancestorId) return true;
    node = node.parentId ? (allById.get(node.parentId) ?? null) : null;
  }
  return false;
}

export function computeOverIndex(
  cloned: FlattenedItem[],
  parentId: string | null,
  overId: string | null
): number {
  const idxById = (id: string | null) =>
    id != null ? cloned.findIndex((x) => x.id === id) : -1;

  const overIndex = idxById(overId);
  if (overIndex !== -1) return overIndex;

  // fallback: last sibling in target parent
  const siblingIndexes: number[] = [];
  for (let i = 0; i < cloned.length; i++)
    if (cloned[i].parentId === parentId) siblingIndexes.push(i);
  return siblingIndexes.length ? siblingIndexes[siblingIndexes.length - 1] : 0;
}

export interface SpecialCaseResult {
  clonedItems: FlattenedItem[];
  finalParentId: string | null;
  finalDepth: number;
  finalOverIndex: number;
  finalActiveIndex: number;
  newElementId?: string;
  skipArrayMove: boolean;
}

export function handleSpecialCases(
  clonedItems: FlattenedItem[],
  moveNode: FlattenedItem,
  parentId: string | null,
  depth: number,
  overIndex: number,
  activeIndex: number,
  allById: Map<string, FlattenedItem>,
  dragOffset = 0
): SpecialCaseResult {
  let finalParentId = parentId;
  let finalDepth = depth;
  let finalOverIndex = overIndex;
  let finalActiveIndex = activeIndex;
  let newElementId: string | undefined;
  let skipArrayMove = false;

  const parent = allById.get(parentId ?? "");

  // Special case: Individual item from multi-item Cloneable needs new Cloneable wrapper
  const originalParent = allById.get(moveNode.parentId ?? "");
  if (
    originalParent &&
    originalParent.type === ElementTypes.Cloneable &&
    (moveNode.type === ElementTypes.Button ||
      moveNode.type === ElementTypes.Icon)
  ) {
    // Check if the original Cloneable has multiple items
    const originalSiblings = allById.get(originalParent.id)?.children || [];
    if (originalSiblings.length > 1) {
      // Create a new Cloneable wrapper for the individual item
      newElementId = uuid();
      const cloneableWrapper: FlattenedItem = {
        id: newElementId,
        type: ElementTypes.Cloneable,
        title: ElementTypes.Cloneable,
        icon: null,
        isHidden: false,
        parentId: parentId,
        depth: depth,
        index: 0,
        children: []
      };

      // Update the item to be a child of the new Cloneable
      finalParentId = newElementId;
      finalDepth = depth + 1;

      // Insert the Cloneable wrapper at the correct position in clonedItems
      const isDraggingBelow = dragOffset > 0;
      const cloneableInsertIndex = isDraggingBelow ? overIndex + 1 : overIndex;
      clonedItems.splice(cloneableInsertIndex, 0, cloneableWrapper);

      finalOverIndex = overIndex;

      // Update the activeIndex if the Cloneable was inserted before the active item
      if (cloneableInsertIndex <= activeIndex) {
        finalActiveIndex = activeIndex + 1;
      }

      // Skip arrayMove because the item will be placed inside the Cloneable via parentId relationship
      skipArrayMove = true;
    }
  }
  // Special case: Column moved to Section (root level) or to a non-Row parent needs Row wrapper
  else if (
    moveNode.type === ElementTypes.Column &&
    parent?.type !== ElementTypes.Row
  ) {
    // Create a Row wrapper for the Column
    newElementId = uuid();
    const rowWrapper: FlattenedItem = {
      id: newElementId,
      type: ElementTypes.Row,
      title: ElementTypes.Row,
      icon: null,
      isHidden: false,
      parentId: parentId,
      depth: depth,
      index: 0,
      children: []
    };

    // Update the column to be a child of the row
    finalParentId = newElementId;
    finalDepth = depth + 1;

    // Insert the row wrapper at the correct position in clonedItems
    // Use drag offset to determine if dragging above or below
    const isDraggingBelow = dragOffset > 0;
    const rowInsertIndex = isDraggingBelow ? overIndex + 1 : overIndex;
    clonedItems.splice(rowInsertIndex, 0, rowWrapper);

    finalOverIndex = overIndex;

    // Update the activeIndex if the row was inserted before the active item
    if (rowInsertIndex <= activeIndex) {
      finalActiveIndex = activeIndex + 1;
    }

    // Skip arrayMove because the column will be placed inside the row via parentId relationship
    skipArrayMove = true;
  }

  return {
    clonedItems,
    finalParentId,
    finalDepth,
    finalOverIndex,
    finalActiveIndex,
    newElementId,
    skipArrayMove
  };
}

export function checkForSectionLevelReorder(
  moveNode: FlattenedItem,
  oldIndex: number,
  newIndex: number,
  allItems: FlattenedItem[]
): boolean {
  // Check if the moved node is a section type
  if (!SECTION_TYPES.has(moveNode.type)) {
    return false;
  }

  // Check if the move is at root level (depth 0)
  if (moveNode.depth !== 0) {
    return false;
  }

  // Check if both old and new positions are at root level
  const oldItem = allItems[oldIndex];
  const newItem = allItems[newIndex];

  if (!oldItem || !newItem) {
    return false;
  }

  // Both items should be at root level (depth 0) for section reordering
  return oldItem.depth === 0 && newItem.depth === 0;
}

export const getDragPad = (depth: number) => {
  switch (depth) {
    case 0:
      return "18px";
    case 1:
      return "10px";
    case 2:
      return "6px";
    default:
      return "0px";
  }
};

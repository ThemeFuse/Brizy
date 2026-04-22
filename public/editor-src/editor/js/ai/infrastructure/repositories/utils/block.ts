import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import { setIds } from "visual/utils/models";
import type { AddBlockParams } from "../../../application/interfaces/i-page-repository";
import type { ElementSummary } from "../../../entities/models";

/**
 * Builds element summary recursively for page structure
 */
export function buildElementSummary(
  items: Block[] | undefined,
  depth: number,
  maxDepth: number
): ElementSummary[] {
  if (!items || depth >= maxDepth) return [];

  return items.map((item) => ({
    id: item.value?._id || "",
    type: item.type || "Unknown",
    label: item.value?.text || item.value?.content || undefined,
    children:
      depth < maxDepth - 1
        ? buildElementSummary(item.value?.items, depth + 1, maxDepth)
        : undefined
  }));
}

/**
 * Maps block type to its item type (e.g., Section → SectionItem)
 * Returns null if block type doesn't need an item wrapper
 */
function getBlockItemType(blockType: string): string | null {
  switch (blockType) {
    case ElementTypes.Section:
      return ElementTypes.SectionItem;
    case ElementTypes.SectionHeader:
      return ElementTypes.SectionHeaderItem;
    case ElementTypes.SectionFooter:
      return null; // Footer doesn't have a separate item type
    default:
      return ElementTypes.SectionItem;
  }
}

/**
 * Creates a default block with standard structure
 * Structure: Section → SectionItem → (empty, ready for content)
 * Or for Footer: SectionFooter → (empty, ready for content)
 */
export function createDefaultBlock(params: AddBlockParams): Block {
  const itemType = getBlockItemType(params.blockType);

  // Common style properties
  const styleProps = {
    ...(params.background?.bgColorHex && {
      bgColorHex: params.background.bgColorHex,
      bgColorOpacity: params.background.bgColorOpacity ?? 1
    }),
    ...(params.paddingTop !== undefined && {
      paddingTop: params.paddingTop,
      paddingTopSuffix: "px"
    }),
    ...(params.paddingBottom !== undefined && {
      paddingBottom: params.paddingBottom,
      paddingBottomSuffix: "px"
    })
  };

  // SectionFooter doesn't have an item wrapper - content goes directly inside
  if (!itemType) {
    const block = {
      type: params.blockType,
      blockId: `${params.blockType}Default`,
      value: {
        _styles: ["section-footer"],
        items: [],
        ...styleProps
      }
    };
    return setIds(block);
  }

  // Section and SectionHeader need an item wrapper
  const block = {
    type: params.blockType,
    blockId: `${params.blockType}Default`,
    value: {
      _styles: ["section"],
      items: [
        {
          type: itemType,
          value: {
            _styles: ["section-item"],
            items: [],
            ...styleProps
          }
        }
      ]
    }
  };

  return setIds(block);
}

/**
 * Parses backend block data and sets IDs.
 * Validates structural requirements before accepting into Redux.
 */
export function parseBackendBlockData(blockData: unknown): Block {
  if (!blockData || typeof blockData !== "object") {
    throw new Error("Block data must be an object");
  }

  const data = blockData as Record<string, unknown>;

  if (!data.type || typeof data.type !== "string") {
    throw new Error('Block data must have a string "type" property');
  }

  if (!data.value || typeof data.value !== "object") {
    throw new Error('Block data must have a "value" object');
  }

  return setIds(blockData) as Block;
}

/**
 * Clones a block with new IDs
 */
export function cloneBlockWithNewIds(block: Block): Block {
  return setIds(block);
}

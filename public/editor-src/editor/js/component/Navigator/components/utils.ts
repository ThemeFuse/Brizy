import { Num, Obj, Str } from "@brizy/readers";
import { getTranslationsMap } from "visual/editorComponents/Wrapper/contextMenu";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { TreeItem, TreeItems } from "visual/providers/TreeProvider/types";
import { supportsShowOnDevice } from "visual/providers/TreeProvider/utils";
import { getSampleShortCodes } from "visual/shortcodeComponents/Shortcodes";
import { Block } from "visual/types/Block";
import { t } from "visual/utils/i18n";
import { SECTION_TYPES } from "./Tree/utils";

const DISABLED_TYPES = [
  ElementTypes.Wrapper,
  ElementTypes.Wrapper2,
  ElementTypes.Cloneable,
  ElementTypes.StoryWrapper
];

const DISABLED_ITEMS_FIELDS = [
  "item",
  "field",
  "step",
  "tablebody",
  "tablehead",
  "tablerow",
  "tablecol",
  "tableaside"
];

// Container types that hide their children in the navigator
const CONTAINER_TYPES = [
  ElementTypes.Table,
  ElementTypes.Form2,
  ElementTypes.FormFields
];

// Helper function to check if an element type is a container
const isContainerType = (type: string): boolean => {
  return CONTAINER_TYPES.some((containerType) =>
    type.startsWith(containerType)
  );
};
const EXCLUDED_DISABLED_TYPES = [
  ElementTypes.SectionHeaderStickyItem,
  ElementTypes.SectionHeaderItem,
  ElementTypes.AccordionItem,
  ElementTypes.Tab,
  ElementTypes.FlipboxItem,
  ElementTypes.StoryItem
];
const DISABLED_STYLES = ["hide-row-borders"];

const normaliseWidgetType = (type: string): string => {
  switch (type) {
    case ElementTypes.RichText:
      return "Text";
    case ElementTypes.EmbedCode:
      return "Embed";
    case ElementTypes.Column:
      return "Columns";
    case "WPPostsTitle":
      return "PostTitle";
    case ElementTypes.PostExcerpt:
      return "PostExcerpt";
  }

  return type;
};

interface ParentConfig {
  type: string;
  isHidden: boolean;
  suffix: string;
  isSectionSlider: boolean;
}

const getElementProperties = (it: Block): Omit<ParentConfig, "type"> => {
  const {
    showOnDesktop,
    showOnTablet,
    showOnMobile,
    cssId,
    cssClass,
    anchorName,
    customClassName,
    customID,
    slider
  } = it.value;

  return {
    isHidden:
      showOnDesktop === "off" &&
      showOnTablet === "off" &&
      showOnMobile === "off",
    suffix: anchorName || cssId || customID || cssClass || customClassName,
    isSectionSlider: slider === "on"
  };
};

const getCloneableContentType = (
  items: Block[]
): "icons" | "buttons" | "empty" => {
  if (!items || items.length === 0) {
    return "empty";
  }

  const hasIcons = items.some((item) => item.type === ElementTypes.Icon);
  const hasButtons = items.some((item) => item.type === ElementTypes.Button);

  if (hasIcons) {
    return "icons";
  }

  if (hasButtons) {
    return "buttons";
  }

  return "empty";
};

function getNormalisedTitle(
  type: string,
  value: Record<string, unknown>
): string {
  const translationMap = getTranslationsMap();
  const title = translationMap[type as keyof typeof translationMap];

  const fallbackTitle =
    type === ElementTypes.SectionPopup2 ? ElementTypes.SectionPopup : type;

  const normalisedTitle = title ?? fallbackTitle;

  return typeof normalisedTitle === "function"
    ? normalisedTitle(value)
    : normalisedTitle;
}

export const buildTree = (
  blocks: Block[],
  config: ConfigCommon,
  globalBlocksKeys: string[]
): TreeItem[] => {
  const stack: {
    blocks: Block[];
    parent?: ParentConfig;
    target: TreeItem[];
    isInContainer?: boolean;
  }[] = [{ blocks, target: [], isInContainer: false }];

  const root: TreeItem[] = stack[0].target;
  const shortcodes = getSampleShortCodes(config);

  while (stack.length > 0) {
    const { blocks, parent, target, isInContainer = false } = stack.pop() ?? {};
    if (!blocks) continue;

    for (let i = 0; i < blocks.length; i++) {
      const it = blocks[i];
      const { _id: id, items, _styles = [] } = it.value;
      const type = it.type as ElementTypes;

      const isExcludedFromDisabledTypes =
        EXCLUDED_DISABLED_TYPES.includes(type);
      const isDisabledType = DISABLED_TYPES.includes(type);
      const hasDisabledStyle = DISABLED_STYLES.some((style) =>
        _styles.includes(style)
      );
      const hasDisabledItemField = DISABLED_ITEMS_FIELDS.some((item) =>
        type.toLowerCase().includes(item)
      );

      // Check if current element is a container or if we're already inside a container
      const isContainerElement = isContainerType(type);
      const isInsideContainer = isInContainer || isContainerElement;

      // Special handling for Cloneable elements
      let shouldShowCloneable = false;
      if (type === ElementTypes.Cloneable && Array.isArray(items)) {
        const contentType = getCloneableContentType(items);
        shouldShowCloneable = items.length > 1 && contentType !== "empty";
      }

      let invalidElement =
        !isExcludedFromDisabledTypes &&
        (isDisabledType ||
          hasDisabledStyle ||
          hasDisabledItemField ||
          isInContainer);

      // Override invalidElement for Cloneable if it should be shown
      if (type === ElementTypes.Cloneable && shouldShowCloneable) {
        invalidElement = false;
      }

      const supportsValues = supportsShowOnDevice(type);
      const parentSupportsValues = parent && supportsShowOnDevice(parent.type);

      let properties = { isHidden: false, suffix: "", isSectionSlider: false };
      let isHidden = false;
      let suffix = "";
      let isSectionSlider = false;

      if (supportsValues) {
        properties = getElementProperties(it);
        isHidden = properties.isHidden;
        suffix = properties.suffix;
        isSectionSlider = properties.isSectionSlider;
      } else if (parentSupportsValues) {
        isHidden = parent.isHidden;
        suffix = parent.suffix;
        isSectionSlider = parent.isSectionSlider;
      }

      if (type === ElementTypes.SectionItem && parent?.isSectionSlider) {
        // Show the SectionItem in the tree for section slider
        invalidElement = false;
      }

      const _type = normaliseWidgetType(type);
      let title = getNormalisedTitle(type, it.value);

      // Special title handling for Cloneable elements
      if (
        type === ElementTypes.Cloneable &&
        shouldShowCloneable &&
        Array.isArray(items)
      ) {
        const contentType = getCloneableContentType(items);
        if (contentType === "icons") {
          title = t("Icon Container");
        } else if (contentType === "buttons") {
          title = t("Button Container");
        }
      }

      const isGlobalBlock =
        SECTION_TYPES.has(type) && globalBlocksKeys.includes(id);

      if (isGlobalBlock) {
        title = title + " " + t("(Global Block)");
      }

      const currentShortcode = Obj.readKey(_type)(shortcodes);
      const icon = Obj.isObject(currentShortcode)
        ? Str.read(currentShortcode.icon)
        : null;

      // Create node, default children=null
      const node: TreeItem = {
        id,
        type,
        children: null,
        icon: icon ?? null,
        title,
        suffixTitle: suffix || null,
        collapsed: true,
        isHidden,
        visible: !invalidElement
      };

      if (target) target.push(node);

      if (Array.isArray(items)) {
        // Only set children to [] if items exist
        node.children = [];
        for (let j = items.length - 1; j >= 0; j--) {
          stack.push({
            blocks: [items[j]],
            parent: { type, isHidden, suffix, isSectionSlider },
            target: node.children,
            isInContainer: isInsideContainer
          });
        }
      }
    }
  }

  return root;
};

export function collectVisibilityKey(
  blocks: Record<string, Block> | Block[]
): string {
  const rootBlocks = Array.isArray(blocks)
    ? blocks
    : Object.values(blocks ?? {});

  return walk(rootBlocks);
}

const walk = (items: Block[]): string => {
  const parts: string[] = [];

  for (const block of items) {
    const {
      _id,
      showOnDesktop = "on",
      showOnTablet = "on",
      showOnMobile = "on",
      cssId,
      cssClass,
      anchorName,
      customClassName,
      customID,
      items: children
    } = block.value;

    const title =
      cssId || customID || cssClass || anchorName || customClassName || "";
    const key = `${_id}:${showOnDesktop}:${showOnTablet}:${showOnMobile}:${title}`;

    parts.push(key);
    if (children && children.length > 0) {
      parts.push(walk(children));
    }
  }

  return parts.join("|");
};

export type SizeSettings = {
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 320;

export const getLayoutSettings = (): SizeSettings => {
  const initialSize: SizeSettings = {
    width: DEFAULT_WIDTH
  };
  try {
    const raw = localStorage.getItem("brz-navigator:layout");
    if (raw) {
      const parsed = JSON.parse(raw);
      const width = Num.read(parsed.width);
      const height = Num.read(parsed.height);

      if (width && (width < 100 || width > 1000)) {
        return initialSize;
      }
      if (height && (height < 100 || height > 1000)) {
        return initialSize;
      }

      return {
        width,
        height
      };
    }
    return initialSize;
  } catch (_) {
    return initialSize;
  }
};

export const setLayoutSettings = (settings: Partial<SizeSettings>): void => {
  try {
    const raw = localStorage.getItem("brz-navigator:layout");
    let parsed = {};
    if (raw) {
      parsed = JSON.parse(raw);
    }

    const toStore = {
      ...parsed,
      ...settings
    };

    localStorage.setItem("brz-navigator:layout", JSON.stringify(toStore));
  } catch (e) {
    console.error(e);
  }
};

// Preserve collapsed state across tree rebuilds
export function mapCollapsed(
  items: TreeItems,
  acc: Map<string, boolean> = new Map()
): Map<string, boolean> {
  for (const item of items) {
    if (typeof item.collapsed !== "undefined") {
      acc.set(item.id, item.collapsed);
    }
    if (item.children && item.children.length) {
      mapCollapsed(item.children, acc);
    }
  }
  return acc;
}

export function applyCollapsedWithActive(
  items: TreeItems,
  collapsedById: Map<string, boolean>,
  activeElementId: string | null
): TreeItems {
  const stack: {
    item: TreeItem;
    parentChildren: TreeItem[];
  }[] = [];

  const newTree: TreeItem[] = [];

  // Initialize stack with root items
  for (let i = items.length - 1; i >= 0; i--) {
    stack.push({ item: items[i], parentChildren: newTree });
  }

  while (stack.length > 0) {
    const { item, parentChildren } = stack.pop() ?? {};
    if (!item) continue;

    const isActivePath =
      activeElementId && isDescendantOrSelf(item, activeElementId);

    const newItem: TreeItem = {
      ...item,
      collapsed: isActivePath
        ? false
        : (collapsedById.get(item.id) ?? item.collapsed),
      children: null
    };

    parentChildren?.push(newItem);

    if (Array.isArray(item.children)) {
      newItem.children = [];
      // Push children in reverse order to preserve original order
      for (let i = item.children.length - 1; i >= 0; i--) {
        stack.push({
          item: item.children[i],
          parentChildren: newItem.children
        });
      }
    }
  }

  return newTree;
}

function isDescendantOrSelf(item: TreeItem, targetId: string): boolean {
  if (item.id === targetId) return true;
  if (!item.children) return false;
  return item.children.some((child) => isDescendantOrSelf(child, targetId));
}

export function hasVisibleChildren(item: TreeItem): boolean {
  if (!item.children || item.children.length === 0) {
    return false;
  }

  return item.children.some((child) => {
    if (child.visible) {
      return true;
    }

    return hasVisibleChildren(child);
  });
}

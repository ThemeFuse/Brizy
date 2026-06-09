import type { ToolHandler } from "../entities/models";
import {
  addStyleSchema,
  updateStyleSchema
} from "../infrastructure/repositories/utils";
import { log } from "../utils/logger";
import {
  addBlankBlockSchema,
  addBlocksSchema,
  addFontSchema,
  changeDefaultFontSchema,
  changeStyleSchema,
  deleteFontSchema,
  duplicateBlockSchema,
  duplicateElementSchema,
  duplicateStyleSchema,
  getAvailableIconsSchema,
  getElementByIdSchema,
  getGoogleFontsSchema,
  getPageStructureSchema,
  moveBlockSchema,
  moveElementSchema,
  removeBlockSchema,
  removeElementSchema,
  searchElementsSchema
} from "./infrastructure-schemas";
import type { HandlerDeps, ToolArgs } from "./types";

/**
 * Validate fontFamily values in fontStyles array exist in project fonts.
 */
function validateStyleFonts(
  deps: HandlerDeps,
  parsed: { fontStyles?: Array<{ fontFamily?: string }> }
): { success: false; error: string } | null {
  if (!parsed.fontStyles) return null;

  for (const fs of parsed.fontStyles) {
    if (fs.fontFamily && !deps.projectRepository.fontExists(fs.fontFamily)) {
      return {
        success: false,
        error: `Font "${fs.fontFamily}" not found in project fonts. Use getProjectFonts to see available fonts, or addFont to add it first.`
      };
    }
  }

  return null;
}

/**
 * Create infrastructure tool handlers: read tools, block tools, and generic element tools.
 * These are NOT component-specific.
 */
export function createInfrastructureHandlers(
  deps: HandlerDeps
): Record<string, ToolHandler> {
  const { pageRepository, projectRepository, store } = deps;

  return {
    // ===========================================
    // READ TOOLS
    // ===========================================
    getPageStructure: (args: ToolArgs) => {
      log.tools("getPageStructure input %o", args);

      const parsed = getPageStructureSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const data = pageRepository.getPageStructure(
        parsed.data.depth ?? Infinity
      );
      log.tools("getPageStructure output %o", data);

      return data;
    },

    getElementById: (args: ToolArgs) => {
      log.tools("getElementById input %o", args);

      const parsed = getElementByIdSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const element = pageRepository.getElementById(parsed.data.elementId);
      log.tools("getElementById output %o", element);

      return element;
    },

    searchElements: (args: ToolArgs) => {
      log.tools("searchElements input %o", args);

      const parsed = searchElementsSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const data = pageRepository.searchElements(parsed.data);
      log.tools("searchElements output %o", data);

      return data;
    },

    isPro: () => {
      return { isPro: pageRepository.isPro() };
    },

    getAvailableIcons: async (args: ToolArgs) => {
      log.tools("getAvailableIcons input %o", args);

      const parsed = getAvailableIconsSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const data = await pageRepository.getAvailableIcons(parsed.data);
      log.tools("getAvailableIcons output %o", data);

      return data;
    },

    // ===========================================
    // BLOCK TOOLS
    // ===========================================
    addBlocks: (args: ToolArgs) => {
      log.tools("addBlocks input %o", args);

      const parsed = addBlocksSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const results = parsed.data.blocks.map((entry, i) => {
        try {
          // If blockRef is provided, look up block data from shared store
          let blockData: unknown = entry.blockData;
          if (entry.blockRef) {
            const cachedData = store.get(entry.blockRef);
            if (!cachedData) {
              return {
                success: false as const,
                error: `Block reference "${entry.blockRef}" not found or expired. Please regenerate the block.`
              };
            }
            blockData = cachedData;
            store.delete(entry.blockRef);
            log.tools("retrieved block from store ref=%s", entry.blockRef);
          }

          const result = pageRepository.addBlock({
            blockType: entry.blockType,
            insertIndex: entry.insertIndex,
            blockData
          });

          return result;
        } catch (error) {
          log.tools("addBlocks entry %d failed %o", i, error);
          return {
            success: false as const,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      });

      log.tools("addBlocks output %o", results);

      return { success: true, data: { results } };
    },

    addBlankBlock: (args: ToolArgs) => {
      log.tools("addBlankBlock input %o", args);

      const parsed = addBlankBlockSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const { blockType, insertIndex, paddingTop, paddingBottom } = parsed.data;
      const background =
        parsed.data.bgColorHex || parsed.data.bgColorOpacity !== undefined
          ? {
              bgColorHex: parsed.data.bgColorHex,
              bgColorOpacity: parsed.data.bgColorOpacity
            }
          : undefined;

      const block = pageRepository.addBlock({
        blockType: blockType ?? "Section",
        insertIndex,
        paddingTop,
        paddingBottom,
        background
      });
      log.tools("addBlankBlock output %o", block);

      return block;
    },

    removeBlock: (args: ToolArgs) => {
      log.tools("removeBlock input %o", args);

      const parsed = removeBlockSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const data = pageRepository.removeBlock(parsed.data);
      log.tools("removeBlock output %o", data);

      return data;
    },

    moveBlock: (args: ToolArgs) => {
      log.tools("moveBlock input %o", args);

      const parsed = moveBlockSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = pageRepository.moveBlock(parsed.data);
      log.tools("moveBlock output %o", result);
      return result;
    },

    duplicateBlock: (args: ToolArgs) => {
      log.tools("duplicateBlock input %o", args);

      const parsed = duplicateBlockSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = pageRepository.duplicateBlock(parsed.data);
      log.tools("duplicateBlock output %o", result);
      return result;
    },

    clearPage: () => {
      log.tools("clearPage input");
      const result = pageRepository.clearPage();
      log.tools("clearPage output %o", result);
      return result;
    },

    // ===========================================
    // ELEMENT TOOLS - Generic
    // ===========================================
    removeElement: (args: ToolArgs) => {
      log.tools("removeElement input %o", args);

      const parsed = removeElementSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = pageRepository.removeElement(parsed.data);
      log.tools("removeElement output %o", result);
      return result;
    },

    duplicateElement: (args: ToolArgs) => {
      log.tools("duplicateElement input %o", args);

      const parsed = duplicateElementSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = pageRepository.duplicateElement(parsed.data);
      log.tools("duplicateElement output %o", result);
      return result;
    },

    moveElement: (args: ToolArgs) => {
      log.tools("moveElement input %o", args);

      const parsed = moveElementSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = pageRepository.moveElement(parsed.data);
      log.tools("moveElement output %o", result);
      return result;
    },

    // ===========================================
    // PROJECT TOOLS - Styles & Fonts
    // ===========================================
    getProjectStyles: () => {
      log.tools("getProjectStyles");
      const data = projectRepository.getProjectStyles();
      log.tools("getProjectStyles output %o", data);
      return data;
    },

    changeStyle: (args: ToolArgs) => {
      log.tools("changeStyle input %o", args);

      const parsed = changeStyleSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = projectRepository.changeStyle(parsed.data.styleId);
      log.tools("changeStyle output %o", result);
      return result;
    },

    addStyle: (args: ToolArgs) => {
      log.tools("addStyle input %o", args);

      const parsed = addStyleSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const fontError = validateStyleFonts(deps, parsed.data);
      if (fontError) return fontError;

      const result = projectRepository.addStyle(parsed.data);
      log.tools("addStyle output %o", result);
      return result;
    },

    updateProjectStyle: (args: ToolArgs) => {
      log.tools("updateProjectStyle input %o", args);

      const parsed = updateStyleSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const fontError = validateStyleFonts(deps, parsed.data);
      if (fontError) return fontError;

      const result = projectRepository.updateStyle(parsed.data);
      log.tools("updateProjectStyle output %o", result);
      return result;
    },

    duplicateStyle: (args: ToolArgs) => {
      log.tools("duplicateStyle input %o", args);

      const parsed = duplicateStyleSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = projectRepository.duplicateStyle(parsed.data.title);
      log.tools("duplicateStyle output %o", result);
      return result;
    },

    getProjectFonts: () => {
      log.tools("getProjectFonts");
      const data = projectRepository.getProjectFonts();
      log.tools("getProjectFonts output %o", data);
      return data;
    },

    getGoogleFonts: async (args: ToolArgs) => {
      log.tools("getGoogleFonts input %o", args);

      const parsed = getGoogleFontsSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = await projectRepository.getGoogleFonts(parsed.data);
      log.tools("getGoogleFonts output %o", result);
      return result;
    },

    addFont: async (args: ToolArgs) => {
      log.tools("addFont input %o", args);

      const parsed = addFontSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = await projectRepository.addFont(parsed.data);
      log.tools("addFont output %o", result);
      return result;
    },

    deleteFont: (args: ToolArgs) => {
      log.tools("deleteFont input %o", args);

      const parsed = deleteFontSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const result = projectRepository.deleteFont(parsed.data);
      log.tools("deleteFont output %o", result);
      return result;
    },

    changeDefaultFont: (args: ToolArgs) => {
      log.tools("changeDefaultFont input %o", args);

      const parsed = changeDefaultFontSchema.safeParse(args);
      if (!parsed.success) {
        return { success: false, error: parsed.error.message };
      }

      const { font } = parsed.data;
      if (!projectRepository.fontExists(font)) {
        return {
          success: false,
          error: `Font "${font}" not found in project fonts. Use getProjectFonts to see available fonts, or addFont to add it first.`
        };
      }

      const result = projectRepository.changeDefaultFont(font);
      log.tools("changeDefaultFont output %o", result);
      return result;
    }
  };
}

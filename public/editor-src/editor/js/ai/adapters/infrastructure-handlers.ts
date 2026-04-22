import type { ToolHandler } from "../entities/models";
import {
  addStyleSchema,
  updateStyleSchema
} from "../infrastructure/repositories/utils";
import { log } from "../utils/logger";
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
      const depth = typeof args.depth === "number" ? args.depth : Infinity;

      log.tools("getPageStructure input %o", args);
      const data = pageRepository.getPageStructure(depth);
      log.tools("getPageStructure output %o", data);

      return data;
    },

    getElementById: (args: ToolArgs) => {
      log.tools("getElementById input %o", args);
      const elementId = args.elementId as string;
      const element = pageRepository.getElementById(elementId);
      log.tools("getElementById output %o", element);

      return element;
    },

    searchElements: (args: ToolArgs) => {
      log.tools("searchElements input %o", args);
      const data = pageRepository.searchElements({
        type: args.type as string | undefined,
        typeRegex: args.typeRegex as string | undefined,
        containsText: args.containsText as string | undefined,
        textRegex: args.textRegex as string | undefined,
        blockId: args.blockId as string | undefined,
        limit: args.limit as number | undefined
      });
      log.tools("searchElements output %o", data);

      return data;
    },

    isPro: () => {
      return { isPro: pageRepository.isPro() };
    },

    getAvailableIcons: async (args: ToolArgs) => {
      log.tools("getAvailableIcons input %o", args);
      const data = await pageRepository.getAvailableIcons({
        iconType: args.iconType as "outline" | "glyph" | "fa" | undefined,
        search: args.search as string | undefined,
        limit: args.limit as number | undefined
      });
      log.tools("getAvailableIcons output %o", data);

      return data;
    },

    // ===========================================
    // BLOCK TOOLS
    // ===========================================
    addBlocks: (args: ToolArgs) => {
      log.tools("addBlocks input %o", args);

      const blocks = Array.isArray(args.blocks)
        ? (args.blocks as Array<Record<string, unknown>>)
        : [];

      const results = blocks.map((entry, i) => {
        try {
          // If blockRef is provided, look up block data from shared store
          let blockData = entry.blockData;
          if (entry.blockRef && typeof entry.blockRef === "string") {
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
            blockType: entry.blockType as string,
            insertIndex: entry.insertIndex as number | undefined,
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

      const background =
        args.bgColorHex || args.bgColorOpacity !== undefined
          ? {
              bgColorHex: args.bgColorHex as string | undefined,
              bgColorOpacity: args.bgColorOpacity as number | undefined
            }
          : undefined;

      const block = pageRepository.addBlock({
        blockType: (args.blockType as string) ?? "Section",
        insertIndex: args.insertIndex as number | undefined,
        paddingTop: args.paddingTop as number | undefined,
        paddingBottom: args.paddingBottom as number | undefined,
        background
      });
      log.tools("addBlankBlock output %o", block);

      return block;
    },

    removeBlock: (args: ToolArgs) => {
      log.tools("removeBlock input %o", args);

      const data = pageRepository.removeBlock({
        blockId: args.blockId as string | undefined,
        blockIndex: args.blockIndex as number | undefined
      });
      log.tools("removeBlock output %o", data);

      return data;
    },

    moveBlock: (args: ToolArgs) => {
      log.tools("moveBlock input %o", args);
      const result = pageRepository.moveBlock({
        blockId: args.blockId as string | undefined,
        fromIndex: args.fromIndex as number | undefined,
        toIndex: args.toIndex as number
      });
      log.tools("moveBlock output %o", result);
      return result;
    },

    duplicateBlock: (args: ToolArgs) => {
      log.tools("duplicateBlock input %o", args);
      const result = pageRepository.duplicateBlock({
        blockId: args.blockId as string | undefined,
        blockIndex: args.blockIndex as number | undefined,
        insertAfter: args.insertAfter as boolean | undefined
      });
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
      const result = pageRepository.removeElement({
        elementId: args.elementId as string
      });
      log.tools("removeElement output %o", result);
      return result;
    },

    duplicateElement: (args: ToolArgs) => {
      log.tools("duplicateElement input %o", args);
      const result = pageRepository.duplicateElement({
        elementId: args.elementId as string,
        insertAfter: args.insertAfter as boolean | undefined
      });
      log.tools("duplicateElement output %o", result);
      return result;
    },

    moveElement: (args: ToolArgs) => {
      log.tools("moveElement input %o", args);
      const result = pageRepository.moveElement({
        elementId: args.elementId as string,
        targetContainerId: args.targetContainerId as string,
        targetIndex: args.targetIndex as number | undefined
      });
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
      const result = projectRepository.changeStyle(args.styleId as string);
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
      const result = projectRepository.duplicateStyle(
        args.title as string | undefined
      );
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
      const result = await projectRepository.getGoogleFonts({
        search: args.search as string,
        limit: args.limit as number | undefined
      });
      log.tools("getGoogleFonts output %o", result);
      return result;
    },

    addFont: async (args: ToolArgs) => {
      log.tools("addFont input %o", args);
      const fontType = args.type as string;
      let params;

      switch (fontType) {
        case "google":
          params = {
            type: "google" as const,
            family: args.family as string,
            setAsDefault: args.setAsDefault as boolean | undefined
          };
          break;
        case "adobe":
          params = {
            type: "adobe" as const,
            adobeKitId: args.adobeKitId as string,
            setAsDefault: args.setAsDefault as boolean | undefined
          };
          break;
        default:
          return {
            success: false,
            error: `Unknown font type "${fontType}". Use "google", "adobe", or "upload".`
          };
      }

      const result = await projectRepository.addFont(params);
      log.tools("addFont output %o", result);
      return result;
    },

    deleteFont: (args: ToolArgs) => {
      log.tools("deleteFont input %o", args);
      const result = projectRepository.deleteFont({
        brizyId: args.brizyId as string,
        type: args.type as string
      });
      log.tools("deleteFont output %o", result);
      return result;
    },

    changeDefaultFont: (args: ToolArgs) => {
      log.tools("changeDefaultFont input %o", args);

      const font = args.font as string;
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

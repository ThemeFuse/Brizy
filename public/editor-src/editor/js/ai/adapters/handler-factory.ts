import {
  containerIdSchema,
  elementIdSchema,
  inferStoredFlags,
  insertIndexSchema
} from "@brizy/ai-tools";
import type { ToolHandler } from "../entities/models";
import { log } from "../utils/logger";
import { validateFonts, withColorDefaults } from "./prop-defaults";
import type {
  AddNoPropsToolConfig,
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  ToolConfig,
  UpdateToolConfig
} from "./types";

/**
 * Create a handler for an "add element" tool config.
 */
function createAddHandler(
  config: AddToolConfig,
  deps: HandlerDeps
): ToolHandler {
  // Escape hatch: fully custom handler
  const { handler } = config;

  if (handler) {
    return (args: ToolArgs) => handler(deps, args);
  }

  const toolName = config.alias;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    // withColorDefaults runs for every element, not per config: a hex sent
    // without its palette slot is stored and never painted, and the pairing is
    // derived from the key, so there is nothing an element has to opt into.
    // Several configs still list it in their own pipe; it is idempotent.
    const withFlags = withColorDefaults(inferStoredFlags(config.schema, props));
    const propsWithDefaults = config.defaults
      ? config.defaults(withFlags)
      : withFlags;

    const parsed = config.schema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const initialProperties = config.transformProps
      ? config.transformProps(parsed.data)
      : parsed.data;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: config.elementType,
      insertIndex: insertIndexParsed.data,
      initialProperties
    });

    if (config.afterAdd) {
      config.afterAdd(deps, parsed.data, result);
    }

    log.tools("%s output %o", toolName, result);
    return result;
  };
}

/**
 * Create a handler for an "add element with no props" tool config.
 */
function createAddNoPropsHandler(
  config: AddNoPropsToolConfig,
  deps: HandlerDeps
): ToolHandler {
  const toolName = config.alias;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { containerId, insertIndex } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: config.elementType,
      insertIndex: insertIndexParsed.data
    });
    log.tools("%s output %o", toolName, result);
    return result;
  };
}

/**
 * Create a handler for an "update element" tool config.
 */
function createUpdateHandler(
  config: UpdateToolConfig,
  deps: HandlerDeps
): ToolHandler {
  // Escape hatch: fully custom handler
  const { handler } = config;

  if (handler) {
    return (args: ToolArgs) => handler(deps, args);
  }

  const toolName = config.alias;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    // Optional type validation
    if (config.validateType) {
      const elementResult = deps.pageRepository.getElementById(
        elementIdParsed.data
      );
      if (!elementResult.success) {
        return elementResult;
      }

      const elementType = elementResult.data?.type;
      if (elementType !== config.validateType.expectedType) {
        return {
          success: false,
          error: config.validateType.errorMessage.replace(
            // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token this replaces at runtime, not an interpolation
            "${type}",
            String(elementType)
          )
        };
      }
    }

    // withColorDefaults runs for every element, not per config: a hex sent
    // without its palette slot is stored and never painted, and the pairing is
    // derived from the key, so there is nothing an element has to opt into.
    // Several configs still list it in their own pipe; it is idempotent.
    const withFlags = withColorDefaults(inferStoredFlags(config.schema, props));
    const propsWithDefaults = config.defaults
      ? config.defaults(withFlags)
      : withFlags;

    const parsed = config.schema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    let changes: Record<string, unknown> = config.transformProps
      ? config.transformProps(parsed.data)
      : parsed.data;

    if (config.beforeUpdate) {
      changes = config.beforeUpdate(deps, elementIdParsed.data, changes);
    }

    const method = config.updateMethod ?? "updateElement";
    const result = deps.pageRepository[method]({
      elementId: elementIdParsed.data,
      elementType: config.elementType,
      changes
    });

    // Side writes run only after the main update lands, so a rejected update
    // leaves no stray change behind.
    if (config.afterUpdate && result.success) {
      const sideResult = config.afterUpdate(
        deps,
        elementIdParsed.data,
        parsed.data,
        result
      );

      if (sideResult && !sideResult.success) {
        log.tools("%s afterUpdate failed %o", toolName, sideResult);
        return sideResult;
      }
    }

    log.tools("%s output %o", toolName, result);
    return result;
  };
}

/**
 * Build a handler from any ToolConfig.
 *
 * Every flow first fills in the stored flags the patch needs — the render
 * toggles the catalog deliberately never asks the LLM for — against the
 * element's own schema, so a flag the element spells differently, or does not
 * have at all, is left alone.
 *
 * Every flow then validates font families against the project before writing:
 * `validateFonts` walks the parsed props for `*FontFamily` keys and does
 * nothing when there are none, so it costs nothing on elements that carry no
 * type. Detecting the keys rather than declaring a flag means a new element
 * with a font cannot forget to opt in.
 */
export function buildHandler(
  config: ToolConfig,
  deps: HandlerDeps
): ToolHandler {
  switch (config.kind) {
    case "add":
      return createAddHandler(config, deps);
    case "addNoProps":
      return createAddNoPropsHandler(config, deps);
    case "update":
      return createUpdateHandler(config, deps);
  }
}

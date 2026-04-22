import type { ToolHandler } from "../entities/models";
import { log } from "../utils/logger";
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
  if (config.handler) {
    return (args: ToolArgs) => config.handler!(deps, args);
  }

  const toolName = config.definition.name;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = config.defaults ? config.defaults(props) : props;

    const parsed = config.schema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const initialProperties = config.transformProps
      ? config.transformProps(parsed.data)
      : parsed.data;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: config.elementType,
      insertIndex: insertIndex as number | undefined,
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
  const toolName = config.definition.name;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { containerId, insertIndex } = args;
    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: config.elementType,
      insertIndex: insertIndex as number | undefined
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
  if (config.handler) {
    return (args: ToolArgs) => config.handler!(deps, args);
  }

  const toolName = config.definition.name;

  return (args: ToolArgs) => {
    log.tools("%s input %o", toolName, args);
    const { elementId, ...props } = args;

    // Optional type validation
    if (config.validateType) {
      const elementResult = deps.pageRepository.getElementById(
        elementId as string
      );
      if (!elementResult.success) {
        return elementResult;
      }

      const elementType = elementResult.data?.type;
      if (elementType !== config.validateType.expectedType) {
        return {
          success: false,
          error: config.validateType.errorMessage.replace(
            "${type}",
            String(elementType)
          )
        };
      }
    }

    const propsWithDefaults = config.defaults ? config.defaults(props) : props;

    const parsed = config.schema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    let changes: Record<string, unknown> = config.transformProps
      ? config.transformProps(parsed.data)
      : parsed.data;

    if (config.beforeUpdate) {
      changes = config.beforeUpdate(deps, elementId as string, changes);
    }

    const method = config.updateMethod ?? "updateElement";
    const result = deps.pageRepository[method]({
      elementId: elementId as string,
      elementType: config.elementType,
      changes
    });
    log.tools("%s output %o", toolName, result);
    return result;
  };
}

/**
 * Build a handler from any ToolConfig.
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

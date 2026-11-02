import {
  columnPropsSchema,
  elementIdSchema,
  inferDeviceStoredFlags
} from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { log } from "../../utils/logger";
import {
  inferBgColorType,
  inferBorderRadiusType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

export const withColumnDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferBorderRadiusType
);
export const addColumnConfig: AddToolConfig = {
  kind: "add",
  alias: "addColumn",
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults
};
export const updateColumnConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateColumn",
  elementType: ElementTypes.Column,
  schema: columnPropsSchema,
  defaults: withColumnDefaults,
  updateMethod: "updateColumn",
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateColumn input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    // This handler keeps its own desktop inference, so the shared flag pass
    // never runs here; the tablet and mobile half of it still has to.
    const propsWithDefaults = withColumnDefaults(
      inferDeviceStoredFlags(columnPropsSchema, props)
    );
    const parsed = columnPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const result = deps.pageRepository.updateColumn({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Column,
      changes: parsed.data
    });
    log.tools("updateColumn output %o", result);
    return result;
  }
};

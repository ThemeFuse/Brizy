import {
  containerIdSchema,
  elementIdSchema,
  inferDeviceStoredFlags,
  insertIndexSchema,
  switcherPropsSchema
} from "@brizy/ai-tools";
import { setIn } from "timm";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import { log } from "../../utils/logger";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

type Props = Record<string, unknown>;
// custom typography (typographyFontSize, etc.) requires typographyFontStyle:"" to override preset
const CUSTOM_TYPOGRAPHY_KEYS = [
  "typographyFontSize",
  "typographyFontWeight",
  "typographyLineHeight",
  "typographyLetterSpacing"
];
const inferCustomFontStyle = <T extends Props>(props: T): T =>
  !("typographyFontStyle" in props) &&
  CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, typographyFontStyle: "" }
    : props;
const withTypographyFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "typography");
export const withSwitcherDefaults = pipe(
  withColorDefaults,
  withTypographyFontFamily,
  inferCustomFontStyle
);
/**
 * Sync labelText1/labelText2 to SwitcherTab items.
 *
 * The Switcher has two label systems:
 * - Style-1 (default): each SwitcherTab reads its own `labelText`
 * - Style-2: the parent Switcher reads `labelText1`/`labelText2`
 *
 * This function propagates parent-level labels into the items array
 * so both styles stay in sync via a single updateElement call.
 */
export function withSwitcherLabelSync(
  currentItems: unknown[] | undefined,
  changes: Record<string, unknown>
): Record<string, unknown> {
  const { labelText1, labelText2 } = changes as {
    labelText1?: string;
    labelText2?: string;
  };

  if (labelText1 === undefined && labelText2 === undefined) {
    return changes;
  }

  if (!Array.isArray(currentItems)) {
    return changes;
  }

  const items = currentItems.map((item: unknown, index: number): unknown => {
    const el = item as { value?: Record<string, unknown> };
    if (!el?.value) return item;

    if (index === 0 && labelText1 !== undefined) {
      return setIn(el, ["value", "labelText"], labelText1);
    }
    if (index === 1 && labelText2 !== undefined) {
      return setIn(el, ["value", "labelText"], labelText2);
    }
    return item;
  });

  return { ...changes, items };
}
export const addSwitcherConfig: AddToolConfig = {
  kind: "add",
  alias: "addSwitcher",
  elementType: ElementTypes.Switcher,
  schema: switcherPropsSchema,
  defaults: withSwitcherDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addSwitcher input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const containerIdParsed = containerIdSchema.safeParse(containerId);
    if (!containerIdParsed.success) {
      return { success: false, error: containerIdParsed.error.message };
    }

    const insertIndexParsed = insertIndexSchema.safeParse(insertIndex);
    if (!insertIndexParsed.success) {
      return { success: false, error: insertIndexParsed.error.message };
    }

    const propsWithDefaults = withSwitcherDefaults(props);
    const parsed = switcherPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Switcher,
      insertIndex: insertIndexParsed.data,
      initialProperties: parsed.data
    });

    // Sync labelText1/labelText2 into SwitcherTab items after creation
    const { labelText1, labelText2 } = parsed.data;
    if (
      result.success &&
      result.data?.childElementId &&
      (labelText1 !== undefined || labelText2 !== undefined)
    ) {
      const elResult = deps.pageRepository.getElementById(
        result.data.childElementId
      );
      if (elResult.success && elResult.data) {
        const currentItems = elResult.data.value?.items as
          | unknown[]
          | undefined;
        const changes = withSwitcherLabelSync(currentItems, parsed.data);
        deps.pageRepository.updateElement({
          elementId: result.data.childElementId,
          elementType: ElementTypes.Switcher,
          changes
        });
      }
    }

    log.tools("addSwitcher output %o", result);
    return result;
  }
};
export const updateSwitcherConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSwitcher",
  elementType: ElementTypes.Switcher,
  schema: switcherPropsSchema,
  defaults: withSwitcherDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateSwitcher input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    // This handler keeps its own desktop inference, so the shared flag pass
    // never runs here; the tablet and mobile half of it still has to.
    const propsWithDefaults = withSwitcherDefaults(
      inferDeviceStoredFlags(switcherPropsSchema, props)
    );
    const parsed = switcherPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    // Sync labelText1/labelText2 into SwitcherTab items
    const elResult = deps.pageRepository.getElementById(elementIdParsed.data);
    const currentItems = elResult.success
      ? (elResult.data?.value?.items as unknown[] | undefined)
      : undefined;
    const changes = withSwitcherLabelSync(currentItems, parsed.data);

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.Switcher,
      changes
    });
    log.tools("updateSwitcher output %o", result);
    return result;
  }
};

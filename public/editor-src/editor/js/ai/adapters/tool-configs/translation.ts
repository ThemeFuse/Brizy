import { translationPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  restoreColorOpacity,
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type {
  AddNoPropsToolConfig,
  HandlerDeps,
  UpdateToolConfig
} from "../types";

const withTranslationDefaults = (props: Record<string, unknown>) =>
  withAllFontFamilyNormalize(withColorDefaults(props));

const BORDER_KEYS = ["borderWidth", "borderColorHex", "borderColorPalette"];

/**
 * The closed switcher ships with no border: `borderStyle: ""` and a
 * transparent `borderColorOpacity`. A border edit has to switch both on, the
 * way the toolbar does — style from `tempBorderStyle`, opacity from its temp —
 * or it reports success and draws nothing. Only an empty stored style is
 * replaced, so a dashed border stays dashed when just its colour changes.
 */
const withBorderStyle = (
  stored: Record<string, unknown>,
  changes: Record<string, unknown>
): Record<string, unknown> => {
  const needsStyle =
    changes.borderStyle === undefined &&
    stored.borderStyle === "" &&
    BORDER_KEYS.some((key) => changes[key] !== undefined);

  return needsStyle
    ? { ...changes, borderStyle: stored.tempBorderStyle ?? "solid" }
    : changes;
};

const translationBeforeUpdate = (
  deps: HandlerDeps,
  elementId: string,
  changes: Record<string, unknown>
): Record<string, unknown> => {
  const el = deps.pageRepository.getElementById(elementId);

  return el.success && el.data
    ? restoreColorOpacity(
        el.data.value,
        withBorderStyle(el.data.value, changes)
      )
    : changes;
};

/** Created bare: it lists the project's languages by itself. */
export const addTranslationConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  alias: "addTranslation",
  elementType: ElementTypes.Translation
};

export const updateTranslationConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTranslation",
  elementType: ElementTypes.Translation,
  schema: translationPropsSchema,
  defaults: withTranslationDefaults,
  beforeUpdate: translationBeforeUpdate
};

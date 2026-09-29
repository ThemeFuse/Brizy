import { resetPasswordPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  restoreColorOpacity,
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, HandlerDeps, UpdateToolConfig } from "../types";

const withResetPasswordDefaults = (props: Record<string, unknown>) =>
  withAllFontFamilyNormalize(withColorDefaults(props));

/**
 * The password boxes ship with `bgColorOpacity: 0` — the toolbar's "no
 * background" state — so a hex-only edit would leave the form looking
 * unchanged. Restoring the opacity needs the element's stored value, which is
 * what `beforeUpdate` is for (Menu precedent).
 */
const resetPasswordBeforeUpdate = (
  deps: HandlerDeps,
  elementId: string,
  changes: Record<string, unknown>
): Record<string, unknown> => {
  if (!Object.keys(changes).some((key) => key.endsWith("Hex"))) {
    return changes;
  }

  const el = deps.pageRepository.getElementById(elementId);

  return el.success && el.data
    ? restoreColorOpacity(el.data.value, changes)
    : changes;
};

/**
 * Both configs stay declarative. The factory already parses the id anchors,
 * runs `inferStoredFlags` — which is what sets `boxShadow: "on"`, the
 * border/padding grouping modes and clears the type presets — and calls
 * `validateFonts`, returning its error. There is nothing left for the custom
 * `handler` escape hatch to add.
 */
export const addResetPasswordConfig: AddToolConfig = {
  kind: "add",
  alias: "addResetPassword",
  elementType: ElementTypes.ResetPassword,
  schema: resetPasswordPropsSchema,
  defaults: withResetPasswordDefaults
};

export const updateResetPasswordConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateResetPassword",
  elementType: ElementTypes.ResetPassword,
  schema: resetPasswordPropsSchema,
  defaults: withResetPasswordDefaults,
  beforeUpdate: resetPasswordBeforeUpdate
};

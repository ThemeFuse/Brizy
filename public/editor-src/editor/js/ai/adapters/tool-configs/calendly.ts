import { calendlyPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
export function withCalendlyDefaults<T extends Props>(props: T): T {
  let result = withColorDefaults(props);

  // Auto-enable boxShadow when shadow props are provided
  if (
    !("boxShadow" in result) &&
    (("boxShadowBlur" in result && result.boxShadowBlur !== undefined) ||
      ("boxShadowSpread" in result && result.boxShadowSpread !== undefined) ||
      ("boxShadowVertical" in result &&
        result.boxShadowVertical !== undefined) ||
      ("boxShadowHorizontal" in result &&
        result.boxShadowHorizontal !== undefined))
  ) {
    result = { ...result, boxShadow: "on" };
  }

  // Auto-set bgColorType to gradient when gradient props are provided
  if (
    !("bgColorType" in result) &&
    (("gradientColorHex" in result && result.gradientColorHex !== undefined) ||
      ("gradientType" in result && result.gradientType !== undefined))
  ) {
    result = { ...result, bgColorType: "gradient" };
  }

  return result;
}
export const addCalendlyConfig: AddToolConfig = {
  kind: "add",
  alias: "addCalendly",
  elementType: ElementTypes.Calendly,
  schema: calendlyPropsSchema,
  defaults: withCalendlyDefaults
};
export const updateCalendlyConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateCalendly",
  elementType: ElementTypes.Calendly,
  schema: calendlyPropsSchema,
  defaults: withCalendlyDefaults
};

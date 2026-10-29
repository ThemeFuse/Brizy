import { soundCloudPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
export function withSoundCloudDefaults<T extends Props>(props: T): T {
  // Apply standard color defaults (border, boxShadow)
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

  return result;
}
export const addSoundCloudConfig: AddToolConfig = {
  kind: "add",
  alias: "addSoundCloud",
  elementType: ElementTypes.SoundCloud,
  schema: soundCloudPropsSchema,
  defaults: withSoundCloudDefaults
};
export const updateSoundCloudConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSoundCloud",
  elementType: ElementTypes.SoundCloud,
  schema: soundCloudPropsSchema,
  defaults: withSoundCloudDefaults
};

import { audioPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

type Props = Record<string, unknown>;
const AUDIO_COLOR_PAIRS: Array<{ hex: string; palette: string }> = [
  { hex: "bg2ColorHex", palette: "bg2ColorPalette" },
  { hex: "controlsHex", palette: "controlsPalette" }
];
export function withAudioDefaults<T extends Props>(props: T): T {
  // Apply standard color defaults (bg, color, border, boxShadow)
  let result = withAllFontFamilyNormalize(withColorDefaults(props));

  // Apply audio-specific color defaults (bg2, controls)
  for (const { hex, palette } of AUDIO_COLOR_PAIRS) {
    if (hex in result && result[hex] !== undefined && !(palette in result)) {
      (result as Props)[palette] = "";
    }
  }

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
export const addAudioConfig: AddToolConfig = {
  kind: "add",
  alias: "addAudio",
  elementType: ElementTypes.Audio,
  schema: audioPropsSchema,
  defaults: withAudioDefaults
};
export const updateAudioConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateAudio",
  elementType: ElementTypes.Audio,
  schema: audioPropsSchema,
  defaults: withAudioDefaults
};

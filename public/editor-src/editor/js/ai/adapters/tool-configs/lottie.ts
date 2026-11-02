import { lottiePropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withLottieDefaults = withColorDefaults;
export const addLottieConfig: AddToolConfig = {
  kind: "add",
  alias: "addLottie",
  elementType: ElementTypes.Lottie,
  schema: lottiePropsSchema,
  defaults: withLottieDefaults
};
export const updateLottieConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateLottie",
  elementType: ElementTypes.Lottie,
  schema: lottiePropsSchema,
  defaults: withLottieDefaults
};

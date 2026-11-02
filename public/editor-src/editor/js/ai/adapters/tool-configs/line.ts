import { linePropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withLineDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const addLineConfig: AddToolConfig = {
  kind: "add",
  alias: "addLine",
  elementType: ElementTypes.Line,
  schema: linePropsSchema,
  defaults: withLineDefaults
};
export const updateLineConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateLine",
  elementType: ElementTypes.Line,
  schema: linePropsSchema,
  defaults: withLineDefaults
};

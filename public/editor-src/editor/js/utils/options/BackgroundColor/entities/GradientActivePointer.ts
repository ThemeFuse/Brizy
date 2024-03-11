import { Reader } from "visual/utils/types/Type";

export type GradientActivePointer = "start" | "end";

export const read: Reader<GradientActivePointer> = v =>
  v === "start" || v === "end" ? v : undefined;

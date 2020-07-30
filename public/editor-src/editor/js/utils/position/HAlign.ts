import { Reader } from "visual/utils/types/Type";

export type HAlign = "left" | "right";

export const aligns: HAlign[] = ["left", "right"];

export const read: Reader<HAlign> = v =>
  aligns.includes(v as HAlign) ? (v as HAlign) : undefined;

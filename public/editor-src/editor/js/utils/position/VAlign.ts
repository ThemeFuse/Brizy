import { Reader } from "visual/utils/types/Type";

export type VAlign = "top" | "bottom";

export const aligns: VAlign[] = ["top", "bottom"];

export const read: Reader<VAlign> = v =>
  aligns.includes(v as VAlign) ? (v as VAlign) : undefined;

import { WidthType } from "visual/utils/options/Border/entities/widthType";

export const toggleType = (v: WidthType): WidthType =>
  v === "grouped" ? "ungrouped" : "grouped";

import { WidthType } from "visual/component/Options/types/dev/Border/entities/widthType";

export const toggleType = (v: WidthType): WidthType =>
  v === "grouped" ? "ungrouped" : "grouped";

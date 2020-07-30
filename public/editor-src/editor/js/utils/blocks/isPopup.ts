import { Block } from "visual/types";

export const isPopup = (block: Block): boolean =>
  block?.type === "SectionPopup" || block?.type === "SectionPopup2";

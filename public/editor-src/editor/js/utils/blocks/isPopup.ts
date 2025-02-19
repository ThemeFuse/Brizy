import { Block } from "visual/types/Block";

export const isPopup = (block: Block): boolean =>
  block?.type === "SectionPopup" || block?.type === "SectionPopup2";

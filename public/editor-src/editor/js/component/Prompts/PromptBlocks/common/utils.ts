import { BlockTypes } from "../types";

export const isBlock = (type: BlockTypes): type is "BLOCK" => type === "BLOCK";
export const isPopup = (type: BlockTypes): type is "POPUP" => type === "POPUP";
export const isLayout = (type: BlockTypes): type is "LAYOUT" =>
  type === "LAYOUT";

import Config from "visual/global/Config";

export const getCurrentMode = () => Config.get("mode") || "page";

export const IS_PAGE = getCurrentMode() === "page";
export const IS_INTERNAL_POPUP = getCurrentMode() === "internal_popup";
export const IS_EXTERNAL_POPUP = getCurrentMode() === "external_popup";
export const IS_GLOBAL_POPUP = IS_INTERNAL_POPUP || IS_EXTERNAL_POPUP;

export const isGlobalPopup = type =>
  type === "internal_popup" || type === "external_popup";

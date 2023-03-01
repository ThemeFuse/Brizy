import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const isTemplate = (config: ConfigCommon): boolean =>
  config.mode === "template";

//#region Story

export const isInternalStory = ({ mode }: ConfigCommon): boolean =>
  mode === "internal_story";

export const isExternalStory = ({ mode }: ConfigCommon): boolean =>
  mode === "external_story";

export const isStory = (config: ConfigCommon): boolean =>
  isExternalStory(config) || isInternalStory(config);

//#endregion

//#region Popup

export const isExternalPopup = ({ mode }: ConfigCommon): boolean =>
  mode === "external_popup";

export const isInternalPopup = ({ mode }: ConfigCommon): boolean =>
  mode === "internal_popup";

export const isPopup = (config: ConfigCommon): boolean =>
  isExternalPopup(config) || isInternalPopup(config);

//#endregion

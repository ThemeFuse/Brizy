import Conf, { Config } from "visual/global/Config";

export const getCurrentMode = (): string => Conf.get("mode") || "page";

/**
 * @deprecated, use isInternalStory(config)
 */
export const IS_INTERNAL_STORY = getCurrentMode() === "internal_story";

/**
 * @deprecated, use isExternalStory(config)
 */
export const IS_EXTERNAL_STORY = getCurrentMode() === "external_story";

/**
 * @deprecated, use isStory(config)
 */
export const IS_STORY = IS_INTERNAL_STORY || IS_EXTERNAL_STORY;

export const IS_TEMPLATE = getCurrentMode() === "template";

/**
 * @deprecated, use isInternalPopup(config)
 */
export const IS_INTERNAL_POPUP = getCurrentMode() === "internal_popup";

/**
 * @deprecated, use isExternalPopup(config)
 */
export const IS_EXTERNAL_POPUP = getCurrentMode() === "external_popup";

/**
 * @deprecated, use isPopup(config)
 */
export const IS_GLOBAL_POPUP = IS_INTERNAL_POPUP || IS_EXTERNAL_POPUP;

//#region Story

export const isInternalStory = ({ mode }: Config): boolean =>
  mode === "internal_story";

export const isExternalStory = ({ mode }: Config): boolean =>
  mode === "external_story";

export const isStory = (config: Config): boolean =>
  isExternalStory(config) || isInternalStory(config);

//#endregion

//#region Popup

export const isExternalPopup = ({ mode }: Config): boolean =>
  mode === "external_popup";

export const isInternalPopup = ({ mode }: Config): boolean =>
  mode === "internal_popup";

export const isPopup = (config: Config): boolean =>
  isExternalPopup(config) || isInternalPopup(config);

//#endregion

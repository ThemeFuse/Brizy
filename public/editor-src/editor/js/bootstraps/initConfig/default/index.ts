import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { mCompose } from "visual/utils/value";
import { addDefault as addAPI } from "./api";
import { addDefault as addLeftSidebar } from "./leftSidebar";
import { addDefault as addPopup } from "./popup";

export const withDefaultConfig = <C extends ConfigCommon>(config: C): C => {
  const withDefault = mCompose<C, C, C, C>(addLeftSidebar, addPopup, addAPI);
  return withDefault(config) ?? config;
};

import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { addDefault as addAPI } from "./api";

export const withDefaultConfig = <C extends ConfigCommon>(config: C): C => {
  return addAPI(config) ?? config;
};

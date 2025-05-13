import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const currentUserRole = (config: ConfigCommon): string =>
  config.user?.role ?? "admin";

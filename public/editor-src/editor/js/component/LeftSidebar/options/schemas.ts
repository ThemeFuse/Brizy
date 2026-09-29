import { z } from "zod";
import { LeftSidebarPageSettingsOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";

export const pageSettingsOptionIdSchema = z.nativeEnum(
  LeftSidebarPageSettingsOptionsIds
);

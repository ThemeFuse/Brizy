import { ToastNotification } from "visual/component/Notifications";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import { BlockCategory } from "../../types";
import { BLOCK, LAYOUT, LibraryProps, POPUP } from "../types";

export const getBlocksType = (
  type: LibraryProps["type"],
  api: ConfigCommon["api"] = {}
): BlockCategory[] => {
  if (type === "normal") {
    const { savedLayouts, savedBlocks } = api;
    const types: BlockCategory[] = [];

    if (savedBlocks?.get && savedBlocks?.getByUid) {
      types.push({ id: BLOCK, title: t("Blocks"), icon: "nc-blocks" });
    }

    if (savedLayouts?.get && savedLayouts?.getByUid) {
      types.push({ id: LAYOUT, title: t("Layouts"), icon: "nc-pages" });
    }

    if (types.length > 0) {
      return types;
    }

    ToastNotification.error(t("API: No saved blocks or layouts found."));
    return [];
  }
  const { savedPopups } = api;

  if (savedPopups?.get && savedPopups.getByUid) {
    return [{ id: POPUP, title: t("Popups"), icon: "nc-blocks" }];
  }

  ToastNotification.error(t("API: No saved popups found."));
  return [];
};

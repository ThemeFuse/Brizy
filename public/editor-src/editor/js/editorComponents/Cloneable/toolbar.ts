import { t } from "visual/utils/i18n";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";
import { GetItems } from "visual/editorComponents/EditorComponent/types";

// @ts-expect-error: old option
export const getItems: GetItems = ({ v, device }) => {
  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      position: 1
    }),
    {
      id: "advancedSettings",
      type: "advancedSettings",
      title: t("Settings"),
      devices: "desktop",
      position: 110,
      roles: ["admin"],
      icon: "nc-cog"
    }
  ];
};

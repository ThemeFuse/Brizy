import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";

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
      type: "legacy-advancedSettings",
      title: t("Settings"),
      devices: "desktop",
      position: 110,
      roles: ["admin"],
      icon: "nc-cog"
    }
  ];
};

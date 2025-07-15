import React from "react";
import { TooltipIcon } from "visual/component/Controls/LeftSidebar/AddElements";
import { HelpVideos } from "visual/global/Config/types/configs/ConfigCommon";
import { useTranslation } from "visual/providers/I18nProvider";
import { HelpVideoLink } from "../Drawer/HelpVideoLink";
import { SidebarModes } from "../Drawer/types";

interface ExtraControls {
  sidebarMode: SidebarModes | null;
  setSidebarMode: (mode: SidebarModes | null) => void;
}

export function SidebarExtraControls({
  setSidebarMode,
  sidebarMode
}: ExtraControls) {
  const { t } = useTranslation();

  return sidebarMode !== null ? (
    <TooltipIcon
      icon="nc-success"
      overlayText={t("Done")}
      onClick={() => setSidebarMode(null)}
    />
  ) : (
    <>
      <TooltipIcon
        icon="nc-eye-ban-18"
        overlayText={t("Edit")}
        onClick={() => setSidebarMode(SidebarModes.EDIT)}
      />
      <TooltipIcon
        icon="nc-sidebar-pin"
        overlayText={t("Pin Elements")}
        onClick={() => setSidebarMode(SidebarModes.PIN)}
      />
      <HelpVideoLink videoKey={HelpVideos.addElementsHelpVideo} />
    </>
  );
}

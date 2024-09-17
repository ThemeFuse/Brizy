import React from "react";
import { TooltipIcon } from "./TooltipIcon";
import { t } from "visual/utils/i18n";

interface Props {
  onClick: VoidFunction;
  isActive: boolean;
  nonActiveText: string;
  nonActiveIcon: string;
}

export const HeaderIcon = ({
  onClick,
  isActive,
  nonActiveIcon,
  nonActiveText
}: Props): JSX.Element => (
  <div className="brz-ed-sidebar__elements--icon" onClick={onClick}>
    {isActive ? (
      <TooltipIcon icon="nc-success" overlayText={t("Done")} key="Done" />
    ) : (
      <TooltipIcon
        icon={nonActiveIcon}
        overlayText={nonActiveText}
        key={nonActiveText}
      />
    )}
  </div>
);

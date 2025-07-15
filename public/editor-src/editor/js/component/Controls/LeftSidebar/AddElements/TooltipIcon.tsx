import React from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  icon: string;
  overlayText: string;
  onClick?: VoidFunction;
}

export const TooltipIcon = ({
  icon,
  overlayText,
  onClick
}: Props): JSX.Element => (
  <Tooltip
    overlay={
      <div className="brz-ed-sidebar-drawer__head__icon__tooltip">
        {overlayText}
      </div>
    }
    openOnClick={false}
    size="auto"
    placement="bottom"
  >
    <EditorIcon icon={icon} onClick={onClick} />
  </Tooltip>
);

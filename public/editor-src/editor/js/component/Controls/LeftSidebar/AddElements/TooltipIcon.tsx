import React from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  icon: string;
  overlayText: string;
}

export const TooltipIcon = ({ icon, overlayText }: Props): JSX.Element => (
  <Tooltip
    overlay={
      <div className="brz-ed-sidebar__elements--icon--tooltip">
        {overlayText}
      </div>
    }
    openOnClick={false}
    size="auto"
    placement="bottom"
  >
    <EditorIcon icon={icon} />
  </Tooltip>
);

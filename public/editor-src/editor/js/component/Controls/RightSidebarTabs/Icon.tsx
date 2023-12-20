import React, { ReactElement } from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  icon: string;
  title: string;
  onClick: VoidFunction;
}

export const Icon = ({ icon, title, onClick }: Props): ReactElement => (
  <Tooltip
    overlay={
      <div className="brz-ed-control__right-sidebar-tabs__icon__tooltip">
        {title}
      </div>
    }
    openOnClick={false}
    size="auto"
    placement="bottom"
    className="brz-ed-control__right-sidebar-tabs__icon"
  >
    <EditorIcon onClick={onClick} icon={icon} />
  </Tooltip>
);

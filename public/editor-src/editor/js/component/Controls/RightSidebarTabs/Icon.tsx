import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  icon: string;
  title: string;
  onClick: VoidFunction;
}

export const Icon = ({ icon, title, onClick }: Props): ReactElement => {
  return (
    <div className="brz-ed-control__right-sidebar-tabs__icon">
      <EditorIcon icon={icon} onClick={onClick} />
      <div className="brz-ed-control__right-sidebar-tabs__icon__tooltip">
        {title}
      </div>
    </div>
  );
};

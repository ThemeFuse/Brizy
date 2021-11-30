import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  active: boolean;
}

export const CheckGroupIcon = ({ active }: Props): ReactElement => {
  return (
    <div className="brz-control__check-group-option-icon">
      <EditorIcon
        icon={active ? "nc-check-square-on" : "nc-check-square-off"}
      />
    </div>
  );
};

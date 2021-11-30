import React, { ReactElement } from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  className?: string;
}

export const Loading = ({ className }: Props): ReactElement => {
  return (
    <div className={classNames("brz-ed-popup-content--loading", className)}>
      <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
    </div>
  );
};

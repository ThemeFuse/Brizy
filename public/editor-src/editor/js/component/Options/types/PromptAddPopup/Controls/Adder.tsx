import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  onClick?: VoidFunction;
}

export const Adder = (props: Props): ReactElement => {
  return (
    <div className="brz-ed-control__focal-point__label">
      <div
        className="brz-ed-control__focal-point__upload"
        onClick={props.onClick}
      >
        <EditorIcon icon="nc-add" />
      </div>
    </div>
  );
};

import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { FCC } from "visual/utils/react/types";

interface Props {
  onClick?: VoidFunction;
}

export const Adder: FCC<Props> = ({ onClick }) => (
  <div className="brz-ed-control__focal-point__label">
    <div className="brz-ed-control__focal-point__upload" onClick={onClick}>
      <EditorIcon icon="nc-add" />
    </div>
  </div>
);

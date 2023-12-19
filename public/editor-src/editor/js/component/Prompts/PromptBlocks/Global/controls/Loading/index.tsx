import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export const Loading = (): ReactElement => (
  <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
    <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
  </div>
);

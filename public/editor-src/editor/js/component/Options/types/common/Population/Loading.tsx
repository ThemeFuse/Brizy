import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export const Loading: React.FC = () => (
  <div className="brz-ed-control__population--loading">
    <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
  </div>
);

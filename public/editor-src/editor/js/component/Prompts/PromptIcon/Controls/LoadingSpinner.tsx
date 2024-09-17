import EditorIcon from "visual/component/EditorIcon";
import React from "react";

export const LoadingSpinner = (): JSX.Element => (
  <div
    style={{
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#828b92",
      fontSize: "35px"
    }}
  >
    <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
  </div>
);

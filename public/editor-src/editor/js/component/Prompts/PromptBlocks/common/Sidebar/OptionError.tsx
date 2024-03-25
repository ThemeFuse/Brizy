import React from "react";
import { FCC } from "visual/utils/react/types";

export const OptionError: FCC = (props) => {
  return (
    <div className="brz-ed-popup-two-sidebar-title--error">
      {props.children}
    </div>
  );
};

import React, { FC } from "react";

export const OptionError: FC = (props) => {
  return (
    <div className="brz-ed-popup-two-sidebar-title--error">
      {props.children}
    </div>
  );
};

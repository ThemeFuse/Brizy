import React from "react";

export interface Props {
  label: JSX.Element;
}

export const Label = ({ label }: Props): JSX.Element => (
  <div className="brz-ed-option__label brz-ed-option__font-styles__label">
    {label}
  </div>
);

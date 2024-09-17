import React, { JSX } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { LabelProps } from "./types";

export const Label = ({ label, helperContent }: LabelProps): JSX.Element => (
  <div className="brz-ed-option__label">
    {label}
    {helperContent && (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    )}
  </div>
);

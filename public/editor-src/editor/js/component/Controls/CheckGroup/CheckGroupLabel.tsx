import React from "react";
import type { CheckGroupLabelProps as Props } from "visual/component/Controls/CheckGroup/types";
import EditorIcon from "visual/component/EditorIcon";

export const CheckGroupLabel = ({ label, helperContent }: Props) => (
  <div className="brz-ed-option__label brz-ed-option__check-group__label">
    {label}
    <div className="brz-ed-option__helper">
      <EditorIcon icon="nc-alert-circle-que" />
      <div
        className="brz-ed-option__helper__content"
        dangerouslySetInnerHTML={{ __html: helperContent }}
      />
    </div>
  </div>
);

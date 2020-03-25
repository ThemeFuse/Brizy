import React, { FC } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { TagProps } from "visual/component/Controls/MultiSelect/types/Tag";

export const Tag: FC<TagProps> = ({ onRemove, children }) => {
  const title = typeof children === "string" ? children : "";
  return (
    <div className="brz-ed-control__multiSelect--tag">
      <div className={"brz-ed-control__multiSelect--tag--value"} title={title}>
        {children}
      </div>
      <EditorIcon icon="nc-trash" onClick={onRemove} />
    </div>
  );
};

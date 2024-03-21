import React, { PropsWithChildren } from "react";
import EditorIcon from "visual/component/EditorIcon";

type Props = PropsWithChildren<{ onRemove: () => void }>;

export const Tag = ({ onRemove, children }: Props): JSX.Element => {
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

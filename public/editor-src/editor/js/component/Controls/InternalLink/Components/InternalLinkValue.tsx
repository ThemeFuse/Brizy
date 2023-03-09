import classNames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { InternalLinkValueProps } from "./types";

export const InternalLinkValue = React.forwardRef<
  HTMLDivElement,
  InternalLinkValueProps
>(({ className, value, onRemove, onClick }, ref) => {
  const _className = classNames(
    "brz-ed-control__internalLink__value",
    className
  );

  return (
    <div
      className={_className}
      ref={ref}
      onClick={onClick}
      style={{ position: "relative" }}
    >
      <span className="brz-span">{value}</span>
      {onRemove && <EditorIcon icon="nc-circle-remove" onClick={onRemove} />}
    </div>
  );
});

InternalLinkValue.displayName = "InternalLinkValue";

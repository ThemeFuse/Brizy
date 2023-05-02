import classNames from "classnames";
import React from "react";
import { EditorIcon } from "../../EditorIcon";
import { IconsName } from "../../EditorIcon/types";
import { divStyles } from "../utils";
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
    <div className={_className} ref={ref} onClick={onClick} style={divStyles}>
      <span className="brz-span">{value}</span>
      {onRemove && (
        <EditorIcon icon={IconsName.CircleRemove} onClick={onRemove} />
      )}
    </div>
  );
});

InternalLinkValue.displayName = "InternalLinkValue";

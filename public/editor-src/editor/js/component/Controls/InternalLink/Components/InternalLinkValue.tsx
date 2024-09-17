import classNames from "classnames";
import React from "react";
import { Badge } from "visual/component/Badge";
import EditorIcon from "visual/component/EditorIcon";
import { InternalLinkValueProps } from "./types";

export const InternalLinkValue = React.forwardRef<
  HTMLDivElement,
  InternalLinkValueProps
>(({ className, value, onRemove, onClick, arrow = false, itemStatus }, ref) => {
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
      {itemStatus && (
        <Badge
          status={itemStatus === "published" ? "publish" : itemStatus}
          className="brz-badge-position"
        />
      )}
      {onRemove ? (
        <EditorIcon icon="nc-circle-remove" onClick={onRemove} />
      ) : (
        arrow && (
          <EditorIcon
            icon="nc-stre-down"
            className="brz-control__select--arrow"
          />
        )
      )}
    </div>
  );
});

InternalLinkValue.displayName = "InternalLinkValue";

import React, { JSX } from "react";
import { Tooltip as TooltipControl } from "visual/component/Controls/Tooltip";
import { Tooltip as TooltipProps } from "./types";
import classnames from "classnames";

export const Tooltip = ({
  children,
  className,
  hint
}: TooltipProps): JSX.Element => {
  const cls = classnames("brz-ed-tooltip__content--fix", className);

  return (
    <TooltipControl
      openOnClick={false}
      className={cls}
      overlay={
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{
            __html: hint
          }}
        />
      }
    >
      {children}
    </TooltipControl>
  );
};

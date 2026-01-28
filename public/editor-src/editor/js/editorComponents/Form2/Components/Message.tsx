import classNames from "classnames";
import React, { forwardRef } from "react";
import { MessageStatus } from "../types";

export interface Props {
  status: MessageStatus;
  text: string;
  className?: string;
  textRef?: React.Ref<HTMLSpanElement>;
}

export const Message = forwardRef<HTMLDivElement, Props>(
  ({ status, text, className: _className, textRef }, ref) => {
    const className = classNames(
      "brz-forms2__alert",
      `brz-forms2__alert--${status}`,
      _className
    );

    return (
      // this nesting of divs is needed to support all combinations of our toolbar and sidebar options
      <div className={className} ref={ref}>
        <div className="brz-forms2__alert-text">
          <span className="brz-forms2__alert-text--inner" ref={textRef}>
            {text}
          </span>
        </div>
      </div>
    );
  }
);

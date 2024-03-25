import classnames from "classnames";
import React, { ReactNode, forwardRef } from "react";

interface Props {
  underline?: boolean;
  children: ReactNode;
}

export const Body = forwardRef<HTMLDivElement, Props>(
  ({ underline, children }, ref) => {
    const className = classnames("brz-toc-body", {
      "brz-toc-text-underline": !!underline
    });

    return (
      <div className={className} ref={ref}>
        {children}
      </div>
    );
  }
);

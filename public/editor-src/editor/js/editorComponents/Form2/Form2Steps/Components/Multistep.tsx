import classnames from "classnames";
import React from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  className?: string;
  steps: JSX.Element;
}

export const Multistep: FCC<Props> = ({ className, steps, children }) => (
  <>
    <div className={classnames("brz-form-ms-indicators", className)}>
      {steps}
    </div>
    <div className="brz-form-ms-content">{children}</div>
  </>
);

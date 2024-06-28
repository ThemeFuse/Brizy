import classnames from "classnames";
import React from "react";
import { StyleType } from "visual/editorComponents/Counter/types";

interface Props {
  className: string;
  type: StyleType;
  strokeW: number;
}

export const Chart = ({
  className: _className,
  type,
  strokeW
}: Props): JSX.Element => {
  const className = classnames(
    "brz-counter-chart",
    `brz-counter-chart-${type}`
  );
  const classNameBg = classnames("brz-counter-pie-chart", _className);

  return (
    <div className={className}>
      <svg className="" viewBox="0 0 32 32">
        {type === StyleType.Radial && (
          <circle
            className="brz-counter-radial-chart"
            r={16 - (strokeW > 64 ? 16 : strokeW / 4)}
            cx="16"
            cy="16"
          ></circle>
        )}
        {type === StyleType.Empty && (
          <circle
            className="brz-counter-radial-chart"
            r={16 - (strokeW > 64 ? 16 : strokeW / 4)}
            cx="16"
            cy="16"
          ></circle>
        )}
        <circle className={classNameBg} r="16" cx="16" cy="16"></circle>
      </svg>
    </div>
  );
};

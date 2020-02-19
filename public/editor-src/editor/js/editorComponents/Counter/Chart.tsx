import React from "react";
import classnames from "classnames";

type ChartProps = {
  className: string;
  type: string;
  strokeW: number;
};

export const Chart: React.SFC<ChartProps> = ({
  className: _className,
  type,
  strokeW
}) => {
  const className = classnames("counter-chart", `counter-chart-${type}`);
  const classNameBg = classnames("pie-chart", _className);

  return (
    <div className={className}>
      <svg className="" viewBox="0 0 32 32">
        {type === "radial" && (
          <circle className="radial-chart" r={16 - strokeW / 4} cx="16" cy="16"></circle>
        )}
        {type === "empty" && (
          <circle className="radial-chart" r={16 - strokeW / 4} cx="16" cy="16"></circle>
        )}
        <circle className={classNameBg} r="16" cx="16" cy="16"></circle>
      </svg>
    </div>
  );
};

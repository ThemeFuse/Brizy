import classNames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const ProgressBar2 = (props: Props): ReactElement => {
  const { className, showPercentage, percentage } = props;

  const _className = classNames(
    className,
    "brz-d-xs-flex",
    "brz-progress-bar__wrapper"
  );

  return (
    <>
      {showPercentage && (
        <span
          className="brz-span brz-progress-bar__percent"
          style={{
            marginLeft: `${percentage >= 94 ? percentage - 7 : percentage - 1}%`
          }}
        >
          {percentage}%
        </span>
      )}
      <div className="brz-progress-bar-overlay">
        <div
          className={_className}
          data-progress={percentage}
          style={{
            width: `${percentage}%`,
            maxWidth: `${percentage}%`
          }}
        />
      </div>
    </>
  );
};

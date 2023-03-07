import classNames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const ProgressBar1 = (props: Props): ReactElement => {
  const { className, text, showText, showPercentage, percentage } = props;

  const _className = classNames(
    className,
    "brz-d-xs-flex",
    "brz-align-items-xs-center",
    "brz-progress-bar__wrapper"
  );

  return (
    <div className={_className} data-progress={percentage}>
      {showText && text}
      {showPercentage && (
        <span className="brz-span brz-progress-bar__percent">
          {percentage}%
        </span>
      )}
    </div>
  );
};

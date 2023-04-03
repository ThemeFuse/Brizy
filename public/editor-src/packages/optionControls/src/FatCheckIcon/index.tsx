import classNames from "classnames";
import React, { MouseEventHandler, ReactElement, useCallback } from "react";
import { EditorIcon } from "..";
import { CheckMark } from "./components/CheckMark";
import { Props } from "./types";
import { getActiveClassName } from "./utils";

export const FatCheckIcon = ({
  isActive,
  isChecked,
  className,
  icon,
  label,
  onCheck,
  onClick
}: Props): ReactElement => {
  const _onCheck = useCallback<MouseEventHandler>(
    (e) => {
      onCheck && e.stopPropagation();
      onCheck?.();
    },
    [onCheck]
  );

  const divClassName = classNames(className, "brz-ed--fat-icon");
  const borderClassName = classNames(
    "brz-ed--fat-icon__wrapper",
    getActiveClassName("brz-ed--fat-icon__wrapper--", isActive)
  );
  const labelClassName = classNames(
    "brz-ed--fat-icon__label",
    getActiveClassName("brz-ed--fat-icon__label--", isActive)
  );
  const iconClassName = classNames(
    getActiveClassName("brz-icon-svg__", isActive)
  );

  return (
    <div className={divClassName} onClick={onClick} title={label}>
      <div className={borderClassName}>
        <CheckMark
          isChecked={!!isChecked}
          onClick={_onCheck}
          className="brz-ed--fat-check-icon__check"
        />
        <EditorIcon icon={icon} className={iconClassName} />
      </div>
      <div className={labelClassName}>{label}</div>
    </div>
  );
};

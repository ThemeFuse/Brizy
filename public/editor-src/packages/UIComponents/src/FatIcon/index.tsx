import classNames from "classnames";
import React, { ReactElement } from "react";
import { EditorIcon } from "../EditorIcon";
import { Props } from "./types";

export const FatIcon = ({
  isActive,
  className,
  icon,
  label,
  onClick
}: Props): ReactElement => {
  const activeLabel = classNames("brz-ed--fat-icon__label", {
    "brz-ed--fat-icon__label--active": isActive
  });

  const activeIcon = classNames("brz-ed--fat-icon-icon", {
    "brz-ed--fat-icon-icon--active": isActive
  });

  const activeBorder = classNames("brz-ed--fat-icon__wrapper", {
    "brz-ed--fat-icon__wrapper--active": isActive
  });

  const classNm = classNames(className, "brz-ed--fat-icon", {
    "brz-ed--fat-icon__active": isActive
  });

  return (
    <div className={classNm} onClick={onClick}>
      <div className={activeBorder}>
        <EditorIcon icon={icon} className={activeIcon} />
      </div>
      <div className={activeLabel}>{label}</div>
    </div>
  );
};

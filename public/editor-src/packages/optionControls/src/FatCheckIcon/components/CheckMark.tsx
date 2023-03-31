import classNames from "classnames";
import React, { ReactElement } from "react";
import { IconsName } from "../../EditorIcon/types";
import { EditorIcon } from "../..";
import { CheckMarkProps as Props } from "../types";
import { getCheckedClassName } from "../utils";

export const CheckMark = ({
  isChecked,
  onClick,
  className
}: Props): ReactElement => {
  const checkMarkClassName = classNames(
    "brz-ed--check-mark",
    className,
    getCheckedClassName("brz-ed--check-mark__", isChecked)
  );

  return (
    <span className={checkMarkClassName} onClick={onClick}>
      <EditorIcon icon={IconsName.CheckCircle} />
    </span>
  );
};

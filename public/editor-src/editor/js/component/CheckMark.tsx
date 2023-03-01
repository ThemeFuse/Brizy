import classNames from "classnames";
import React, { MouseEventHandler, ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  checked: boolean;
  onClick?: MouseEventHandler;
}

export const CheckMark = ({
  checked,
  onClick,
  className
}: Props): ReactElement => {
  const checkMarkClassName = checked
    ? "border-0 bg-floating-button-blue"
    : "border-[1px]";

  const isCheckedIcon = checked
    ? "!text-brand-primary opacity-100"
    : "!text-brand-primary opacity-0";

  return (
    <span
      className={classNames(
        "brz-ed--check-mark w-[16px] h-[16px] text-[16px] rounded-[50%] top-[4px] left-[8px] bg-black border-solid border-topaz",
        className,
        { checked },
        checkMarkClassName
      )}
      onClick={onClick}
    >
      <EditorIcon icon="nc-check-circle" className={isCheckedIcon} />
    </span>
  );
};


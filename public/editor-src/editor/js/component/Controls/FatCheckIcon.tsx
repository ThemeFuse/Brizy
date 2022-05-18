import React, { MouseEventHandler, ReactElement, useCallback } from "react";
import classNames from "classnames";
import { WithClassName } from "visual/utils/options/attributes";
import { EditorIcon } from "visual/component/EditorIcon";
import { CheckMark } from "visual/component/CheckMark";

export interface Props extends WithClassName {
  icon: string;
  label: string;
  onClick?: VoidFunction;
  onCheck?: VoidFunction;
  active?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

export const FatCheckIcon = ({
  active,
  checked,
  className,
  icon,
  label,
  onCheck,
  onClick,
  disabled
}: Props): ReactElement => {
  const _onCheck = useCallback<MouseEventHandler>(
    e => {
      onCheck && e.stopPropagation();
      onCheck?.();
    },
    [onCheck]
  );

  return (
    <div
      className={classNames(
        className,
        "brz-ed--fat-icon",
        "brz-ed--fat-check-icon",
        {
          "brz-ed--fat-icon__active": !!active,
          "brz-ed--fat-icon__disabled": !!disabled
        }
      )}
      onClick={onClick}
      title={label}
    >
      <div className={"brz-ed--fat-icon__wrapper"}>
        <CheckMark
          checked={!!checked}
          onClick={_onCheck}
          className={"brz-ed--fat-check-icon__check"}
        />
        <EditorIcon icon={icon} />
      </div>
      <div className={"brz-ed--fat-icon__label"}>{label}</div>
    </div>
  );
};

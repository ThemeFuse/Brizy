import classNames from "classnames";
import React, { MouseEventHandler, ReactElement, useCallback } from "react";
import { CheckMark } from "visual/component/CheckMark";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";

export interface Props extends WithClassName {
  icon: string;
  label: string;
  onClick?: VoidFunction;
  onCheck?: VoidFunction;
  active?: boolean;
  checked?: boolean;
}

export const FatCheckIcon = ({
  active,
  checked,
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

  const activeLabel = active ? "text-brand-primary" : "text-white";
  const activeIcon = active ? "!text-brand-primary" : "!text-white";

  const activeBorder = active
    ? "border-brand-primary"
    : "border-brand-options hover:border-options-border-hover";

  return (
    <div
      className={classNames(
        className,
        "brz-ed--fat-icon text-center w-[60px] cursor-pointer"
      )}
      onClick={onClick}
      title={label}
    >
      <div
        className={`brz-ed--fat-icon__wrapper relative border-2 border-solid rounded-[3px] flex items-center justify-center w-[60px] h-[60px] transition-[border-color] duration-200 ease-linear	delay-[0s] ${activeBorder}`}
      >
        <CheckMark
          checked={!!checked}
          onClick={_onCheck}
          className={
            "brz-ed--fat-check-icon__check absolute -top-[5px] -left-[5px]"
          }
        />
        <EditorIcon
          icon={icon}
          className={`text-[16px] transition-[color] duration-200 ease-linear ${activeIcon}`}
        />
      </div>
      <div
        className={`brz-ed--fat-icon__label transition-[color] duration-200 ease-linear text-[12px] leading-[2.4em] overflow-hidden text-ellipsis whitespace-nowrap ${activeLabel}`}
      >
        {label}
      </div>
    </div>
  );
};

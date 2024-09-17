import classNames from "classnames";
import React, { ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName } from "visual/types/attributes";

export interface Props extends WithClassName {
  icon: string;
  label: string;
  onClick?: VoidFunction;
  active?: boolean;
}

export const FatIcon = ({
  active,
  className,
  icon,
  label,
  onClick
}: Props): ReactElement => {
  const activeLabel = active
    ? "text-right-sidebar-item--active"
    : "text-right-sidebar-item-label";
  const activeIcon = active
    ? "!text-right-sidebar-item--active"
    : "!text-right-sidebar-item";

  const activeBorder = active
    ? "border-right-sidebar-item--active"
    : "border-right-sidebar-item-border  hover:border-right-sidebar-item-border--hover";

  return (
    <div
      title={label}
      className={classNames(
        className,
        "brz-ed--fat-icon text-center w-[60px] cursor-pointer",
        { "brz-ed--fat-icon__active": !!active }
      )}
      onClick={onClick}
    >
      <div
        className={`brz-ed--fat-icon__wrapper border-2 border-solid rounded-[3px] flex items-center justify-center w-[60px] h-[60px] transition-[border-color] duration-200 ease-linear	delay-[0s] ${activeBorder}`}
      >
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

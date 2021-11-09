import React, { FC, MouseEventHandler } from "react";
import classnames from "classnames";

export interface Props {
  paddingSize: "none" | "small" | "medium";
  title?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLLIElement>;
  pointer?: boolean;
  active?: boolean;
}

export const BottomPanelItem: FC<Props> = props => {
  const {
    className,
    title,
    onClick,
    paddingSize,
    pointer,
    active,
    children
  } = props;
  const _className = classnames(
    "brz-li",
    "brz-ed-fixed-bottom-panel__item",
    `brz-ed-fixed-bottom-panel__item--${paddingSize}`,
    { "brz-ed-fixed-bottom-panel__item--pointer": pointer },
    { "brz-ed-fixed-bottom-panel__item--active": active },
    className
  );

  return (
    <li title={title} className={_className} onClick={onClick}>
      {children}
    </li>
  );
};

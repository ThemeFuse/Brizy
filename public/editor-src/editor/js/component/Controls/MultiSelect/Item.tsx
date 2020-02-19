import React, { FC } from "react";
import classNames from "classnames";
import { ItemProps } from "visual/component/Controls/MultiSelect/types/Item";

export const Item: FC<ItemProps> = ({ children, active = false, ...other }) => {
  const className = classNames({
    "brz-ed-control__multiSelect__option": true,
    "brz-ed-control__multiSelect__option--active": active
  });
  const title = typeof children === "string" ? children : "";
  return (
    <li className={className} title={title} {...other}>
      {children}
    </li>
  );
};

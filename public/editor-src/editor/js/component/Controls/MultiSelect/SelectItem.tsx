import React, { PropsWithChildren, ReactElement } from "react";
import classNames from "classnames";

type Props = PropsWithChildren<
  JSX.IntrinsicAttributes & {
    active: boolean;
  }
>;

export function SelectItem({
  children,
  active,
  ...other
}: Props): ReactElement {
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
}

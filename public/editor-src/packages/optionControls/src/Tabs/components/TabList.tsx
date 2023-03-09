import classNames from "classnames";
import React, { ReactElement } from "react";
import { EditorIcon } from "../..//index";
import { TabListProps as Props } from "../types";

export function TabList<T>({
  className,
  active,
  onChange,
  align,
  position,
  children
}: Props<T>): ReactElement {
  const _className = classNames(
    "brz-ul brz-ed-control__tabs",
    `brz-justify-content-xs-${align}`,
    `brz-ed-control__tabs__${position}`,
    className
  );
  const items = children.map((child, index) => {
    const { icon, value, title, label } = child.props;
    const className = classNames("brz-li brz-ed-control__tab", {
      "brz-ed-control__tab__icon": icon,
      active: active === value
    });

    return (
      <li
        key={index}
        title={title}
        className={className}
        onClick={(): void => onChange(value)}
      >
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-span">{label}</span>
      </li>
    );
  });
  return <ul className={_className}>{items}</ul>;
}

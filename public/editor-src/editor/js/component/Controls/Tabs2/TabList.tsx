import React, { ReactElement } from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName, WithOnChange } from "visual/utils/options/attributes";
import { Props as TabProps } from "./Tab";

export type Props<T> = WithClassName &
  WithOnChange<T> & {
    active: T;
    align: "start" | "center" | "end";
    position: "top" | "left";
    children: ReactElement<TabProps<T>>[];
  };

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

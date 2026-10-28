import classNames from "classnames";
import React, { type ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import type { WithClassName, WithOnChange } from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import type { Props as TabProps } from "./Tab";

export type Props<T extends Literal> = WithClassName &
  WithOnChange<T> & {
    active: T;
    align: "start" | "center" | "end";
    position: "top" | "left";
    children: ReactElement<TabProps<T>>[];
  };

export function TabList<T extends Literal>({
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
  const items = children.map((child) => {
    const { icon, value, title, label } = child.props;
    const className = classNames("brz-li brz-ed-control__tab", {
      "brz-ed-control__tab__icon": icon,
      active: active === value
    });

    return (
      <li
        key={value}
        title={title ?? label}
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

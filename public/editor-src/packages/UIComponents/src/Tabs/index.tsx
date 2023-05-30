import classNames from "classnames";
import React, { ReactElement } from "react";
import { TabList } from "./components/TabList";
import { TabsProps as Props } from "./types";

export function Tabs<T>({
  className,
  showSingle,
  children,
  value,
  onChange,
  align,
  position
}: Props<T>): ReactElement | null {
  const _className = classNames("brz-ed-control__tabs-wrapper", className);

  if (children.length === 0) {
    return null;
  }

  const showTabs = children.length > 1 || (showSingle && children.length === 1);
  const active = children.find((t) => t.props.value === value) ?? children[0];
  const activeTab = (
    <div
      className={classNames(
        "brz-ed-control__tab__content",
        `brz-ed-control__tabs__content__${position}`,
        active.props.className
      )}
    >
      {active.props.children}
    </div>
  );

  return showTabs ? (
    <div className={_className}>
      <TabList<T>
        active={active.props.value}
        align={align}
        position={position}
        onChange={onChange}
      >
        {children}
      </TabList>
      {activeTab}
    </div>
  ) : (
    activeTab
  );
}

import React, { Children, FC, ReactElement } from "react";
import classNames from "classnames";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";
import { TabList } from "./TabList";
import * as Tab from "./Tab";

export type Props = WithClassName &
  WithValue<Literal> &
  WithOnChange<Literal> & {
    showSingle: boolean;
    align: "start" | "center" | "end";
    position: "top" | "left";
    children: ReactElement<Tab.Props>[];
  };

export const Tabs: FC<Props> = ({
  className,
  showSingle,
  children,
  value,
  onChange,
  align,
  position
}) => {
  const _className = classNames("brz-ed-control__tabs-wrapper", className);
  const tabs = Children.toArray(children);

  if (tabs.length === 0) {
    return null;
  }

  const showTabs = tabs.length > 1 || (showSingle && tabs.length === 1);
  const active = tabs.find(t => t.props.value === value) ?? tabs[0];
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
      <TabList
        active={active.props.value}
        align={align}
        position={position}
        onChange={onChange}
      >
        {tabs}
      </TabList>
      {activeTab}
    </div>
  ) : (
    activeTab
  );
};

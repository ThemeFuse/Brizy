import classNames from "classnames";
import React, { type ReactElement } from "react";
import type {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/types/attributes";
import type { Literal } from "visual/utils/types/Literal";
import { HorizontalScrollContainer } from "../HorizontalScrollContainer";
import type * as Tab from "./Tab";
import { TabList } from "./TabList";

export type Props<T extends Literal> = WithClassName &
  WithValue<T> &
  WithOnChange<T> & {
    showSingle: boolean;
    align: "start" | "center" | "end";
    position: "top" | "left";
    children: ReactElement<Tab.Props<T>>[];
    horizontalScroll?: boolean;
  };

export function Tabs<T extends Literal>({
  className,
  showSingle,
  children,
  value,
  onChange,
  align,
  position,
  horizontalScroll = false
}: Props<T>): ReactElement | null {
  const _className = classNames("brz-ed-control__tabs-wrapper", className, {
    "brz-ed-control__tabs-wrapper--horizontal-scroll": horizontalScroll
  });

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

  const tabList = (
    <TabList<T>
      active={active.props.value}
      align={align}
      position={position}
      onChange={onChange}
    >
      {children}
    </TabList>
  );

  const tabListContent = horizontalScroll ? (
    <HorizontalScrollContainer>{tabList}</HorizontalScrollContainer>
  ) : (
    tabList
  );

  return showTabs ? (
    <div className={_className}>
      {tabListContent}
      {activeTab}
    </div>
  ) : (
    activeTab
  );
}

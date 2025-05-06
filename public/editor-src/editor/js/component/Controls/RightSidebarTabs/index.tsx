import classNames from "classnames";
import React, { ReactElement, useMemo } from "react";
import { WithValue } from "visual/types/attributes";
import { Props as TabProps } from "../Tabs2/Tab";
import { TabList, Props as TabListProps } from "../Tabs2/TabList";
import { Icon } from "./Icon";
import { Align, Locked } from "./types";
import { alignIcon, alignTitle, lockedIcon, lockedTitle } from "./utils";

type Child<T> = ReactElement<TabProps<T>>;

export interface Props<T> extends WithValue<T> {
  onChange: TabListProps<T>["onChange"];
  children: Array<Child<T>>;
  align: Align;
  onAlign?: VoidFunction;
  locked: Locked;
  onLock?: VoidFunction;
}

export function RightSidebarTabs<T>({
  children,
  value,
  onChange,
  align,
  onAlign,
  locked,
  onLock
}: Props<T>): ReactElement {
  const active: Child<T> | undefined = useMemo(
    () => children.find((t) => t.props.value === value) ?? children[0],
    [children, value]
  );
  const activeTab = useMemo(
    () =>
      active ? (
        <div
          className={classNames(
            "brz-ed-control__tab__content",
            active.props.className
          )}
        >
          {active.props.children}
        </div>
      ) : null,
    [active]
  );

  return (
    <div className="brz-ed-control__right-sidebar-tabs">
      <div className="brz-ed-control__right-sidebar-tabs__header">
        <TabList<T>
          onChange={onChange}
          active={active?.props.value}
          align={"start"}
          position={"top"}
        >
          {children}
        </TabList>
        {onAlign && (
          <Icon
            icon={alignIcon(align)}
            title={alignTitle(align)}
            onClick={onAlign}
          />
        )}
        {onLock && (
          <Icon
            icon={lockedIcon(locked)}
            title={lockedTitle(locked)}
            onClick={onLock}
          />
        )}
      </div>
      {activeTab}
    </div>
  );
}

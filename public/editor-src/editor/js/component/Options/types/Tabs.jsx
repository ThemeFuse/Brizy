import React from "react";
import Options from "visual/component/Options";
import { Tabs, Tab } from "visual/component/Controls/Tabs";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { isT } from "visual/utils/value";

class TabsOptionType extends React.Component {
  static filter(f, t) {
    return {
      ...t,
      tabs:
        t.tabs
          ?.map(tab => ({
            ...tab,
            options: tab?.options?.map(f).filter(isT)
          }))
          .filter(tab => tab?.options?.length > 0) ?? []
    };
  }

  static reduce(fn, t0, item) {
    return (
      item.tabs?.reduce((acc, tab) => tab?.options?.reduce(fn, acc), t0) ?? t0
    );
  }

  static map(fn, item) {
    return {
      ...item,
      tabs: item.tabs?.map(tab => ({ ...tab, options: tab.options.map(fn) }))
    };
  }

  static defaultProps = {
    align: "center",
    hideHandlesWhenOne: true,
    tabs: [],
    location: "",
    value: null,
    toolbar: null
  };

  constructor(props) {
    super(props);

    const [firstTab] = props.tabs;

    this.state = {
      activeTab: firstTab && (firstTab.id || firstTab.label || firstTab.tabIcon)
    };

    this.isControlled = props.value !== null;
  }

  getActiveTab() {
    const { tabs, value } = this.props;
    const hasTabByValue = tabs.some(({ id }) => id === value);

    return this.isControlled && hasTabByValue ? value : this.state.activeTab;
  }

  handleTabChange = tab => {
    if (this.isControlled) {
      this.props.onChange(tab);
    } else {
      if (tab !== this.state.activeTab) {
        this.setState(
          {
            activeTab: tab
          },
          () => {
            const tooltip = getCurrentTooltip();

            if (tooltip) {
              tooltip.reposition();
            }
          }
        );
      }
    }
  };

  sortTabs(tabs) {
    // try to avoid creating a new object when unnecessary
    for (const tab of tabs) {
      if (tab.position !== undefined) {
        return [...tabs].sort(
          (a, b) => (a.position || 100) - (b.position || 100)
        );
      }
    }

    return tabs;
  }

  render() {
    const {
      tabs,
      className: _className,
      tabsPosition,
      tabsClassName,
      hideHandlesWhenOne,
      align,
      location,
      toolbar
    } = this.props;
    const items = this.sortTabs(tabs).map(
      ({ id, title, label, options, tabIcon }) => {
        const newValue = id || label || tabIcon;
        return (
          <Tab
            key={newValue}
            title={title}
            label={label}
            icon={tabIcon}
            value={newValue}
          >
            <Options
              className="brz-ed-tabs__options"
              optionClassName={_className}
              data={options}
              toolbar={toolbar}
              location={location}
            />
          </Tab>
        );
      }
    );

    return (
      <Tabs
        className="brz-ed-tabs__option--inline"
        tabsClassName={tabsClassName}
        tabsPosition={tabsPosition}
        value={this.getActiveTab()}
        align={align}
        hideHandlesWhenOne={hideHandlesWhenOne}
        onChange={this.handleTabChange}
      >
        {items}
      </Tabs>
    );
  }
}

export default TabsOptionType;

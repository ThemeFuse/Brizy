import React from "react";
import Options, { filterOptionsData } from "visual/component/Options";
import { Tabs, Tab } from "visual/component/Controls/Tabs";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";

class TabsOptionType extends React.Component {
  static shouldOptionBeFiltered({ tabs }) {
    return tabs.every(tab => filterOptionsData(tab.options).length === 0);
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

    const [firstTab] = this.filterTabs(props.tabs);

    this.state = {
      activeTab: firstTab && (firstTab.id || firstTab.label || firstTab.tabIcon)
    };

    this.isControlled = props.value !== null;
  }

  getActiveTab() {
    const { tabs, value } = this.props;
    const hasTabByValue = this.filterTabs(tabs).some(({ id }) => id === value);

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

  filterTabs(tabs) {
    return tabs.filter(tab => filterOptionsData(tab.options).length !== 0);
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
    const items = this.filterTabs(tabs).map(
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

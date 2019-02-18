import React from "react";
import Options from "visual/component/Options";
import { Tabs, Tab } from "visual/component/Controls/Tabs";
import { currentTooltip } from "visual/component/Controls/Tooltip";
import { filterOptionsData } from "visual/component/Options";

class TabsOptionType extends React.Component {
  static defaultProps = {
    align: "center",
    hideHandlesWhenOne: true,
    tabs: [],
    location: "",
    value: "",
    toolbar: null
  };

  constructor(props) {
    super(props);

    const [firstTab] = filterOptionsData(props.tabs);

    this.state = {
      activeTab: firstTab.id || firstTab.label || firstTab.tabIcon
    };

    this.isControlled = Boolean(props.value);
  }

  getActiveTab() {
    const { tabs: _tabs, value } = this.props;
    const tabs = filterOptionsData(_tabs);
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
            currentTooltip && currentTooltip.reposition();
          }
        );
      }
    }
  };

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

    const items = filterOptionsData(tabs).map(
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

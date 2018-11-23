import React from "react";
import classnames from "classnames";
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
      value,
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
    const activeTab = this.isControlled ? value : this.state.activeTab;
    const className = classnames("brz-ed-tabs__option--inline");

    return (
      <Tabs
        className={className}
        tabsClassName={tabsClassName}
        tabsPosition={tabsPosition}
        value={activeTab}
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

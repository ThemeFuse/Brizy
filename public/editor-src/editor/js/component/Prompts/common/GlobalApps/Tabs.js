import React, { Component } from "react";
import classnames from "classnames";
import { noop } from "underscore";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";

class Tabs extends Component {
  constructor(props) {
    super(props);

    const { currentTab, tabs } = this.props;

    this.state = {
      loading: true,
      currentTab,
      tabs
    };
  }

  static defaultProps = {
    value: {},
    opened: false,
    tabs: [],
    currentTab: "",
    blockTabsWhenLoading: true,
    onClose: noop
  };

  handleLoading = loading => {
    this.setState({
      loading
    });
  };

  handleTabChange(tabId) {
    if (this.state.loading && this.props.blockTabsWhenLoading) {
      return;
    }

    this.setState({
      currentTab: tabId
    });
  }

  handleTabUpdate(tabId, tabData) {
    const { tabs: _tabs } = this.state;
    const tabs = _tabs.map(tab =>
      tab.id === tabId ? { ...tab, ...tabData } : tab
    );

    this.setState({
      tabs
    });
  }

  renderHeader() {
    const { currentTab, tabs } = this.state;
    const { onClose } = this.props;

    const headerTabs = tabs.map(tab => {
      const { id, icon, img, title } = tab;
      const className = classnames("brz-ed-popup-tab-item", {
        active: id === currentTab
      });

      return (
        <div
          key={id}
          className={className}
          onClick={() => this.handleTabChange(id)}
        >
          {icon && (
            <div className="brz-ed-popup-tab-icon">
              <EditorIcon icon={icon} />
            </div>
          )}
          {img ? (
            <div className="brz-ed-popup-tab-image">
              <img className="brz-img" src={img} alt={title} />
            </div>
          ) : (
            <div className="brz-ed-popup-tab-name">{title}</div>
          )}
        </div>
      );
    });

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{headerTabs}</div>
        <div className="brz-ed-popup-btn-close" onClick={onClose} />
      </div>
    );
  }

  renderCurrentTab() {
    const { tabs, loading, currentTab } = this.state;

    return tabs.reduce((acc, { id, component: Component }) => {
      return id === currentTab
        ? [
            <Component
              {...this.props}
              key={id}
              loading={loading}
              onLoading={this.handleLoading}
              onTabUpdate={tabData => {
                this.handleTabUpdate(id, tabData);
              }}
            />
          ]
        : acc;
    }, []);
  }

  renderTabs() {
    const { tabs, loading, currentTab } = this.state;

    return tabs.map(({ id, component: Component }) => {
      const className = classnames(`brz-ed-popup-integration-${id}`, {
        "brz-hidden": id !== currentTab
      });

      return (
        <Component
          {...this.props}
          key={id}
          loading={loading}
          className={className}
          onTabUpdate={tabData => {
            this.handleTabUpdate(id, tabData);
          }}
        />
      );
    });
  }

  render() {
    const { opened, onClose } = this.props;

    return (
      <Fixed
        className="brz-ed-popup-integrations"
        opened={opened}
        onClose={onClose}
      >
        <div className="brz-ed-popup-wrapper">
          {this.renderHeader()}
          <div className="brz-ed-popup-content">
            {this.state.loading ? this.renderCurrentTab() : this.renderTabs()}
          </div>
        </div>
      </Fixed>
    );
  }
}

export default Tabs;

import { foundUrl } from "@brizy/builder-ui-components";
import classnames from "classnames";
import React, { Component } from "react";
import { noop } from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import HelpIcon from "visual/component/HelpIcon";
import Fixed from "visual/component/Prompts/Fixed";
import { getUrlVideoId } from "visual/component/Prompts/common/GlobalApps/utils";

class Tabs extends Component {
  constructor(props) {
    super(props);

    const { currentTab, tabs } = this.props;

    this.state = {
      loading: true,
      currentTab,
      tabs,
      isHelpVideoOpened: false
    };
  }

  static defaultProps = {
    value: {},
    opened: false,
    tabs: [],
    currentTab: "",
    blockTabsWhenLoading: true,
    onClose: noop,
    config: {}
  };

  handleLoading = (loading) => {
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
    const tabs = _tabs.map((tab) =>
      tab.id === tabId ? { ...tab, ...tabData } : tab
    );

    this.setState({
      tabs
    });
  }

  handleHelpIconClick = () => {
    this.setState((prevState) => ({
      isHelpVideoOpened: !prevState.isHelpVideoOpened
    }));
  };

  renderHeader() {
    const { currentTab, tabs } = this.state;
    const { onClose, config } = this.props;

    const headerTabs = tabs.map((tab) => {
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
            <div className="brz-ed-popup-tab-name" title={title}>
              {title}
            </div>
          )}
        </div>
      );
    });

    const { video, idHelpVideosIcons } = config.ui?.help ?? {};

    const url = foundUrl(
      video ?? [],
      getUrlVideoId(currentTab, idHelpVideosIcons)
    );

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{headerTabs}</div>
        <div className="brz-ed-popup-btn-close" onClick={onClose} />
        {video && url && (
          <HelpIcon
            handleHelpIconClick={this.handleHelpIconClick}
            url={url}
            containerClassName="brz-ed-popup-btn-help"
            iconClassName="icon_helper"
            isHelpVideoOpened={this.state.isHelpVideoOpened}
          />
        )}
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
              onTabUpdate={(tabData) => {
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
          onTabUpdate={(tabData) => {
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

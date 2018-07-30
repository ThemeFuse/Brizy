"use strict";

import _ from "underscore";
import React from "react";
import Config from "visual/global/Config";
import Navigation from "./Navigation";
import Metrics from "./Metrics";
import Settings from "./Settings";

var TABS = {
  // navigation: {
  //     title: 'NAVIGATION',
  //     component: Navigation
  // },
  // metrics: {
  //     title: 'METRICS',
  //     component: Metrics
  // },
  settings: {
    title: "SETTINGS",
    component: Settings
  }
};

function getTabsData() {
  var tabsToOmit = {
    navigation: !Config.get("editorViews")["overlays.navigation"],
    metrics: !Config.get("editorViews")["overlays.metrics"]
  };
  return _.omit(TABS, function(tab, tabId) {
    return Boolean(tabsToOmit[tabId]);
  });
}

class Overlay extends React.Component {
  static defaultProps = {
    tab: "settings",
    onClose: function() {}
  };

  constructor(props) {
    super(props);
    var tabsData = getTabsData(),
      activeTab;

    if (tabsData[props.tab]) {
      activeTab = props.tab;
    } else {
      activeTab = _.keys(tabsData)[0];
    }

    this.state = {
      opened: props.show,
      activeTab: activeTab,
      activeTabProps: _.omit(props, "show", "tab", "onClose")
    };
  }

  componentWillReceiveProps(nextProps) {
    var tabsData = getTabsData();
    var newState = {};

    if (_.has(nextProps, "show")) {
      newState.opened = nextProps.show;
    }
    if (_.has(nextProps, "tab")) {
      newState.activeTab = tabsData[nextProps.tab]
        ? nextProps.tab
        : _.keys(tabsData)[0];
      newState.activeTabProps = _.omit(nextProps, "show", "tab", "onClose");
    }

    if (
      newState.opened !== this.state.opened ||
      newState.activeTab !== this.state.activeTab
    ) {
      this.setState(newState);
    }
  }

  onTabClick = (tab, event) => {
    event.preventDefault();

    if (tab !== this.state.activeTab) {
      this.setState({
        activeTab: tab,
        activeTabProps: {}
      });
    }
  };

  close = () => {
    this.props.onClose();
  };

  renderTabControls = () => {
    var tabsData = getTabsData();

    var tabs = _.map(
      tabsData,
      function(tab, tabId) {
        var key = "overlays-tab-control-" + tabId;
        var title = tab.title;
        var className =
          "brz-ed-large-popup-tab-item" +
          (this.state.activeTab === tabId ? " active" : "");
        return (
          <div
            key={key}
            className={className}
            onClick={this.onTabClick.bind(null, tabId)}
          >
            {title}
          </div>
        );
      },
      this
    );

    var tabIds = _.keys(tabsData);
    var tabsCount = tabIds.length;
    var trackWidth = 570 / tabsCount; // 570 is width of the tabs container
    var trackOffset = trackWidth / 2 - 95; // 95 is half of the width of the track (which is 180)
    var activeTabIndex = tabIds.indexOf(this.state.activeTab);
    var style = {
      left: parseInt(trackOffset + trackWidth * activeTabIndex) + "px"
    };
    return (
      <div
        className={
          "brz-ed-large-popup-tabs brz-ed-large-popup-tabs-" +
          this.state.activeTab
        }
      >
        <div className="brz-ed-large-popup-tabs-inner">
          {tabs}
          <div className="brz-ed-large-popup-tabs-track" style={style} />
        </div>
      </div>
    );
  };

  renderTabs = () => {
    var tabComponent = getTabsData()[this.state.activeTab].component;
    return (
      <div className="brz-ed-large-popup-body active">
        {React.createElement(tabComponent, this.state.activeTabProps)}
      </div>
    );
  };

  render() {
    var tabControls = this.renderTabControls();
    var tabs = this.renderTabs();
    return (
      <div className={`brz-ed-large-popup-${this.state.activeTab}`}>
        {/*{tabControls}*/}
        {tabs}
      </div>
    );
  }
}

export default Overlay;

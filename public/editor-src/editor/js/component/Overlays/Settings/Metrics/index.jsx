"use strict";

var React = require("react"),
  ScrollPane = require("visual/component/ScrollPane"),
  TabHandlers = require("./Tabs/Handlers"),
  TabPanels = require("./Tabs/Panels");

var tabsData = [
  {
    id: "traffic",
    icon: "brz-ed-icon-metric-traffic",
    title: "Traffic Overview"
  },
  {
    id: "mobile",
    icon: "brz-ed-icon-metric-mobile",
    title: "Mobile Usage"
  },
  {
    id: "popular",
    icon: "brz-ed-icon-metric-popular",
    title: "Popular Content"
  },
  {
    id: "refferers",
    icon: "brz-ed-icon-metric-refferers",
    title: "Referrers"
  },
  {
    id: "search",
    icon: "brz-ed-icon-metric-search",
    title: "Search Queries"
  }
];

class Metrics extends React.Component {
  state = {
    active_tab: "traffic"
  };

  handleTabChange = active => {
    this.setState({
      active_tab: active
    });
  };

  render() {
    return (
      <div className="brz-ed-popup-metrics clearfix">
        <div className="brz-ed-popup-metrics-left">
          <TabHandlers
            onChange={this.handleTabChange}
            active={this.state.active_tab}
            tabsData={tabsData}
          />
        </div>
        <div className="brz-ed-popup-metrics-content">
          <ScrollPane style={{ height: "100%" }}>
            <TabPanels active={this.state.active_tab} tabsData={tabsData} />
          </ScrollPane>
        </div>
      </div>
    );
  }
}

export default Metrics;

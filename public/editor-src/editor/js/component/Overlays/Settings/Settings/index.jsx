"use strict";

var _ = require("underscore"),
  React = require("react"),
  ScrollPane = require("visual/component/ScrollPane"),
  TabHandlers = require("./Handlers"),
  TabPanels = require("./Panel");

class Settings extends React.Component {
  state = {
    active: this.props.subtab || "list" //  active tab content
  };

  handleTabChange = active => {
    if (active !== this.state.active) {
      this.setState({
        active: active
      });
    }
  };

  render() {
    return (
      <div className="brz-ed-popup-metrics clearfix">
        <div className="brz-ed-popup-metrics-left">
          <TabHandlers
            active={this.state.active}
            onChange={this.handleTabChange}
          />
        </div>
        <div className="brz-ed-popup-metrics-content">
          <ScrollPane style={{ height: "100%" }}>
            <TabPanels
              active={this.state.active}
              onChange={this.handleTabChange}
            />
          </ScrollPane>
        </div>
      </div>
    );
  }
}

export default Settings;

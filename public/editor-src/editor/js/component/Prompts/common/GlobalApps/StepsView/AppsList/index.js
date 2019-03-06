import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Grid from "./Grid";
import GridItem from "./GridItem";
import { Context } from "../../Context";

class AppList extends Component {
  static contextType = Context;

  static defaultProps = {
    apps: []
  };

  state = {
    loadingApp: "",
    error: null,
    onConnectApp: _.noop
  };

  async handleChangeApp(appData) {
    const { onConnectApp } = this.context;

    onConnectApp(appData);

    this.setState({
      loadingApp: appData.id
    });
  }

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.state.error}</span>
      </div>
    );
  }

  render() {
    const { apps } = this.props;
    const { connectedApps } = this.context;
    const { loadingApp, error } = this.state;

    return (
      <ScrollPane
        style={{ height: "100%" }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations-apps__scroll-pane"
      >
        {error && this.renderError()}
        <Grid
          apps={apps}
          render={app => (
            <GridItem
              {...app}
              key={app.id}
              loading={loadingApp === app.id}
              active={connectedApps.includes(app.id)}
              onClick={() => {
                this.handleChangeApp(app);
              }}
            />
          )}
        />
      </ScrollPane>
    );
  }
}

export default AppList;

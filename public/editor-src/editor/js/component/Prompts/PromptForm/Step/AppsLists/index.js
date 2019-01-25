import React, { Component } from "react";
import ScrollPane from "visual/component/ScrollPane";
import Apps from "./Apps";
import App from "./App";
import { Context } from "../../Context";
import { getIntegration, createIntegration } from "../../utils";

class AppList extends Component {
  static contextType = Context;

  static defaultProps = {
    apps: []
  };

  state = {
    loadingApp: ""
  };

  async handleChangeApp(appData) {
    const { formId, onConnectApp, onChange } = this.context;
    const appId = appData.id;

    this.setState({
      loadingApp: appId
    });

    let integrationData = await getIntegration({
      appId,
      formId
    });

    if (integrationData.code && integrationData.code === 404) {
      integrationData = await createIntegration({
        formId,
        body: {
          id: appId
        }
      });
    }

    onConnectApp(appId);
    onChange(appId, {
      ...appData,
      data: integrationData
    });

    this.setState(
      {
        loadingApp: appId
      },
      () => {
        this.props.onChangeNext();
      }
    );
  }

  render() {
    const { apps } = this.props;
    const { connectedApps } = this.context;
    const { loadingApp } = this.state;

    return (
      <ScrollPane
        style={{ height: 558 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations-apps__scroll-pane"
      >
        <Apps
          apps={apps}
          render={app => (
            <App
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

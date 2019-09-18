import React, { Component } from "react";
import _ from "underscore";
import Config from "visual/global/Config";
import ScrollPane from "visual/component/ScrollPane";
import Grid from "./Grid";
import GridItem from "./GridItem";
import { Context } from "../../Context";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

const ConfigUrls = Config.get("urls");

class AppList extends Component {
  static contextType = Context;

  static defaultProps = {
    apps: [],
    height: "100%",
    proExceptions: false
  };

  state = {
    loadingApp: "",
    error: null,
    onConnectApp: _.noop
  };

  handleChangeApp(appData) {
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

  renderProException() {
    return (
      <div className="brz-ed-alert brz-ed-alert-pro brz-mb-lg-0">
        <span className="brz-span">
          {t("Some integrations are available only in PRO")}
        </span>
        <a
          className="brz-ed-btn brz-ed-btn-width-2 brz-ed-btn-sm brz-ed-btn-icon brz-ed-btn-icon--left brz-ed-btn-rounded brz-ed-btn-pro"
          href={ConfigUrls.upgradeToPro}
          target="_blank"
        >
          <EditorIcon icon="nc-lock" />
          {t("Get Brizy PRO")}
        </a>
      </div>
    );
  }

  render() {
    const { apps, height, proExceptions } = this.props;
    const { connectedApps } = this.context;
    const { loadingApp, error } = this.state;

    return (
      <ScrollPane
        style={{ height }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations-apps__scroll-pane"
      >
        {error && this.renderError()}
        {proExceptions && this.renderProException()}
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

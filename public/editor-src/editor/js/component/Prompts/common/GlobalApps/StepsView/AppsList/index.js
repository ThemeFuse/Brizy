import React, { Component } from "react";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { Context } from "../../Context";
import Grid from "./Grid";
import GridItem from "./GridItem";

const ConfigUrls = Config.get("urls");

class AppList extends Component {
  static contextType = Context;

  static defaultProps = {
    apps: [],
    proExceptions: false,
    error: null
  };

  state = {
    loadingApp: "",
    onConnectApp: _.noop
  };

  componentDidUpdate(nextProps) {
    if (this.props.error !== nextProps.error && this.state.loadingApp) {
      this.setState({ loadingApp: "" });
    }
  }

  handleChangeApp(appData) {
    const { onConnectApp } = this.context;

    onConnectApp(appData);

    this.setState({ loadingApp: appData.id });
  }

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
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
          rel="noopener noreferrer"
          href={ConfigUrls.upgradeToPro}
          target="_blank"
        >
          <EditorIcon icon="nc-lock" />
          {t("Get a PRO plan")}
        </a>
      </div>
    );
  }

  render() {
    const { apps, proExceptions, error, hasDelete, handleDelete } = this.props;
    const { connectedApps } = this.context;
    const { loadingApp } = this.state;
    const isActive = (id) => connectedApps.includes(id);

    return (
      <Scrollbar theme="light">
        {error && this.renderError()}
        {proExceptions && this.renderProException()}
        <Grid
          apps={apps}
          render={(app, idx) => (
            <GridItem
              {...app}
              key={app.id}
              idx={idx}
              loading={loadingApp === app.id}
              active={isActive(app.id)}
              isDeletable={hasDelete && isActive(app.id)}
              handleDelete={handleDelete}
              onClick={() => {
                this.handleChangeApp(app);
              }}
            />
          )}
        />
      </Scrollbar>
    );
  }
}

export default AppList;

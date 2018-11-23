import React, { Component } from "react";
import PropTypes from "prop-types";
import Fixed from "visual/component/Prompts/Fixed";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import AppsList from "./AppsList";
import AppComponents from "./Apps";
import globalApps from "./globalApps.json";
import {
  getIntegrations,
  getIntegration,
  getIntegrationAccount,
  createIntegrations,
  createIntegration,
  getWpIntegrations,
  getWpIntegrationDefault,
  updateWpFormIntegrations
} from "visual/utils/api/integrations";

class PromptForm extends Component {
  static defaultProps = {
    value: {}
  };

  static childContextTypes = {
    connectedApps: PropTypes.array
  };

  state = {
    ...this.props.value,
    formId: this.props.value.id,
    form: {},
    list: [],
    apps: [],
    connectedApps: [],
    currentAppIndex: null,
    currentAppLoading: false
  };

  componentDidMount() {
    this.getForm();
  }

  getChildContext() {
    return {
      connectedApps: this.state.connectedApps
    };
  }

  getForm = () => {
    const {
      apps,
      connectedApps: _connectedApps,
      platforms,
      formId,
      apiUrl,
      wpApiUrl
    } = this.state;

    // getIntegrations(id, { apiUrl }).then(resolve => {
    //   if (resolve.code && resolve.code === 404) {
    //     createIntegrations(id, {
    //       apiUrl,
    //       body: {
    //         form_id: id
    //       }
    //     }).then(resolve => {
    //       this.setState({ apps: [ ...apps, ...resolve ] });
    //     });
    //   } else {
    //     const connectedApps = Object.entries(resolve)
    //       .map(el => el[1] && el[1].fields && el[0])
    //       .filter(el => el);

    //     this.setState({
    //       apps: [ ...apps, ...resolve ],
    //       connectedApps: [..._connectedApps, ...connectedApps]
    //     });
    //   }
    // });

    if (platforms === "wordpress") {
      getWpIntegrations(formId, { wpApiUrl }).then(resolve => {
        if (resolve.data && resolve.data.code === 404) {
          getWpIntegrationDefault(wpApiUrl).then(data => {
            this.setState({
              apps: [...apps, { wordpress: resolve }]
            });
          });
        } else {
          this.setState({
            apps: [...apps, { wordpress: resolve }],
            connectedApps: [..._connectedApps, "wordpress"]
          });
        }
      });
    }
  };

  getIntegration = (id, formId) => {
    const { apiUrl, wpApiUrl } = this.state;

    if (id === "wordpress") {
      return getWpIntegrations(formId, { wpApiUrl }).then(resolve => {
        if (resolve.data && resolve.data.code === 404) {
          getWpIntegrationDefault(wpApiUrl).then(resolve => {
            this.setState({ form: resolve });
          });
        } else {
          this.setState({ form: resolve });
        }
      });
    } else {
      return getIntegration(id, { apiUrl, formId }).then(resolve => {
        if (resolve.status === 204) {
          createIntegration(id, { apiUrl, formId }).then(resolve => {
            this.setState({ form: resolve });
          });
        } else {
          this.setState({ form: resolve });
        }
      });
    }
  };

  getIntegrationList = (id, currentAppIndex) => {
    const { apiUrl } = this.state;

    if (id === "wordpress") {
      this.setState({
        currentAppIndex,
        currentAppLoading: false
      });
    } else {
      getIntegrationAccount(id, { apiUrl }).then(resolve => {
        if (resolve.code && resolve.code === 404) {
          this.setState({
            currentAppIndex,
            currentAppLoading: false
          });
        } else {
          this.setState({
            list: resolve,
            currentAppIndex,
            currentAppLoading: false
          });
        }
      });
    }
  };

  onClickBack = (isDeleted, id) => {
    if (isDeleted) {
      const {
        connectedApps: _connectedApps,
        platforms,
        wpApiUrl,
        formId
      } = this.state;
      const connectedApps = _connectedApps.filter(el => el !== id);

      if (
        connectedApps.length === 1 &&
        platforms === "wordpress" &&
        connectedApps.includes("wordpress")
      ) {
        updateWpFormIntegrations(formId, { wpApiUrl, body: 0 });
      }

      this.setState({ connectedApps });
    }

    this.setState({ currentAppIndex: null });
  };

  onChange = currentAppIndex => {
    this.setState({ currentAppLoading: currentAppIndex });
    const id = globalApps[currentAppIndex].id;
    this.getIntegration(id, this.state.formId, currentAppIndex).then(() => {
      this.getIntegrationList(id, currentAppIndex);
    });
  };

  render() {
    const { onClose } = this.props;
    const {
      currentAppIndex,
      currentAppLoading,
      connectedApps,
      apiUrl,
      wpApiUrl,
      fields,
      form,
      formId,
      list
    } = this.state;
    let content = (
      <AppsList
        apps={globalApps}
        currentAppLoading={currentAppLoading}
        connectedApps={connectedApps}
        onChange={this.onChange}
      />
    );
    let header = (
      <div className="brz-ed-popup-tab-item active">
        <div className="brz-ed-popup-tab-icon brz-ed-popup-tab-icon__svg">
          <EditorIcon icon="nc-extensions-2" />
        </div>
        <div className="brz-ed-popup-tab-name">APPS</div>
      </div>
    );

    const currentApp = globalApps[currentAppIndex];
    const Component = currentApp && AppComponents[currentApp.id];

    if (!Component && !currentAppLoading && currentAppIndex) {
      console.warn(`Need create Integration ${currentApp.id}`);
    }

    if (currentAppIndex !== null && currentAppLoading === false && Component) {
      content = (
        <Component
          {...currentApp}
          apiUrl={apiUrl}
          wpApiUrl={wpApiUrl}
          form={form}
          formId={formId}
          fields={fields}
          list={list}
          onClickBack={this.onClickBack}
          onClose={onClose}
        />
      );

      header = (
        <div className="brz-ed-popup-tab-item active">
          <div className="brz-ed-popup-tab-icon">
            <img
              className="brz-img"
              src={currentApp.img}
              alt={currentApp.title}
            />
          </div>
        </div>
      );
    }

    return (
      <Fixed onClose={onClose}>
        <div className="brz-ed-popup-wrapper brz-ed-popup-wrapper__form-integrations">
          <div className="brz-ed-popup-header">
            <div className="brz-ed-popup-header__tabs">{header}</div>
            <div className="brz-ed-popup-btn-close" onClick={onClose} />
          </div>
          <div className="brz-ed-popup-content brz-ed-popup-pane brz-ed-popup-form">
            <ScrollPane style={{ height: 520 }} className="brz-ed-scroll-pane">
              {content}
            </ScrollPane>
          </div>
        </div>
      </Fixed>
    );
  }
}

export default PromptForm;

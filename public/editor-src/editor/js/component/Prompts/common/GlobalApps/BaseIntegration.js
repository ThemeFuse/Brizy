import React, { Component, Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { Context } from "./Context";
import Steppers from "../Steppers";
import AppList from "./StepsView/AppsList";

class BaseIntegration extends Component {
  static defaultProps = {
    className: "",
    value: {},
    tab: {},
    stage: "",
    stages: [],
    onTabUpdate: _.noop
  };

  state = {
    loading: true,
    showProgress: true,
    connectedApp: "",
    connectedApps: [],
    stage: this.props.stage,
    stages: this.props.stages,
    oldStage: "",
    data: {},
    error: null
  };

  appsData = [];
  appsComponent = {};
  proExceptions = false;

  getContextValue() {
    const { formId, formFields } = this.props.value;
    const {
      connectedApp,
      connectedApps,
      data,
      stages,
      stage,
      oldStage
    } = this.state;

    return {
      app: data[connectedApp] || {},
      connectedApps,
      formId,
      formFields,
      stages,
      stage,
      oldStage,
      onChange: this.handleChange,
      onChangeNext: this.handleNext,
      onChangePrev: this.handlePrev,
      onConnectApp: this.handleConnectApp,
      onDisconnectApp: this.handleDisconnectApp,
      onChangeProgress: this.handleProgress,
      onError: this.handleError
    };
  }

  getConnectedApps(data) {
    const { connectedApps } = this.state;

    return data.reduce((acc, cur) => {
      return cur.completed ? [...acc, cur.id] : acc;
    }, connectedApps);
  }

  handleConnectApp = async appData => {
    const appId = appData.id;
    const { stages } = this.appsData.find(app => app.id === appId);

    this.setState(
      {
        stages,
        connectedApp: appId,
        data: {
          ...this.state.data,
          [`${appId}`]: {
            ...appData
          }
        }
      },
      () => {
        this.handleNext();
      }
    );
  };

  handleDisconnectApp = appId => {
    const { stage, stages } = this.props;

    this.setState(({ connectedApps }) => ({
      stage,
      stages,
      connectedApps: connectedApps.filter(app => app !== appId)
    }));
  };

  handleProgress = progress => {
    this.setState(progress);
  };

  handleChange = (id, appData) => {
    this.setState(({ data }) => ({
      data: {
        ...data,
        [`${id}`]: {
          ...data[id],
          data: appData
        }
      }
    }));
  };

  handleNext = async _nextStage => {
    const { stages, stage, connectedApp } = this.state;
    const nextIdx = stages.findIndex(({ type }) => type === stage) + 1;
    const nextStage = _nextStage || stages[nextIdx].type;
    const Component = this.appsComponent[connectedApp][nextStage];
    let pending = false;

    if (Component && typeof Component.onBeforeLoad === "function") {
      const nextStage = stages[nextIdx + 1].type;
      const props = {
        onChangeNext: _nextStage => {
          const stage = _nextStage || nextStage;
          pending = true;
          this.handleNext(stage);
        }
      };
      await Component.onBeforeLoad(this.getContextValue(), props);
    }

    if (!pending) {
      this.setState({
        stage: nextStage,
        oldStage: stage
      });
    }
  };

  handlePrev = prevStage => {
    this.setState(({ stage, stages, connectedApp }) => {
      if (prevStage === "appList") {
        const { stage, stages } = this.props;

        return {
          stage,
          stages,
          connectedApp: ""
        };
      }

      const prevIdx = stages.findIndex(({ type }) => type === stage) - 1;

      return {
        stage: prevStage || (stages[prevIdx] && stages[prevIdx].type) || "",
        oldStage: stage,
        connectedApp: prevIdx === -1 ? "" : connectedApp
      };
    });
  };

  handleError = error => {
    this.setState({
      error
    });
  };

  renderLoading() {
    return (
      <div className="brz-ed-popup-content--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.state.error}</span>
      </div>
    );
  }

  renderApps() {
    return (
      <Fragment>
        {this.state.error && this.renderError()}
        <AppList apps={this.appsData} proExceptions={this.proExceptions} />
      </Fragment>
    );
  }

  renderSteps() {
    const {
      showProgress: _showProgress,
      stage,
      stages,
      connectedApp,
      data
    } = this.state;
    const showProgress =
      _showProgress && !stages.some(el => el.type === stage).hideProgress;
    const progress = stages.reduce((acc, cur, index, arr) => {
      let props = {
        key: index,
        num: cur.type
      };
      const firstNormalIndex = arr.findIndex(it => it.title);

      if (index === firstNormalIndex) {
        props.img = data[connectedApp].img;
      } else {
        props.text = cur.title;
      }

      return cur.title ? [...acc, <Steppers.Stage {...props} />] : acc;
    }, []);

    return (
      <Context.Provider value={this.getContextValue()}>
        <Steppers stage={stage}>
          {showProgress && progress.length > 0 && (
            <Steppers.Progress>{progress}</Steppers.Progress>
          )}
          <Steppers.Steps onClose={this.props.onClose}>
            {stages.map((step, index) => {
              const Component = this.appsComponent[connectedApp][step.type];

              return (
                <Steppers.Step
                  key={index}
                  num={step.type}
                  render={props => (
                    <Component {...props} apps={this.appsData} />
                  )}
                />
              );
            })}
          </Steppers.Steps>
        </Steppers>
      </Context.Provider>
    );
  }

  renderContent() {
    const { stage, stages } = this.state;

    return (
      <Context.Provider value={this.getContextValue()}>
        {stage !== "" && stages.length ? this.renderSteps() : this.renderApps()}
      </Context.Provider>
    );
  }

  render() {
    const className = classnames(
      "brz-ed-popup-integration",
      this.props.className
    );

    return (
      <div className={className}>
        {this.state.loading ? this.renderLoading() : this.renderContent()}
      </div>
    );
  }
}

export default BaseIntegration;

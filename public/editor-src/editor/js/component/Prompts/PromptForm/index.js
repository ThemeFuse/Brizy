import React from "react";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { capitalize } from "visual/utils/string";
import { applyFilter } from "visual/utils/filters";
import { Context } from "./Context";
import apps from "./app.json";
import Steppers from "./Steppers";
import { getForm, createForm } from "./utils";

const defaultStages = [
  {
    type: "appList",
    hideProgress: true
  }
];

class PromptForm extends React.Component {
  static defaultProps = {
    value: {}
  };

  state = {
    connectedApp: "",
    connectedApps: [],
    stages: defaultStages,
    stage: "appList",
    oldStage: "",
    showProgress: true,
    data: {}
  };

  apps = applyFilter("formIntegrationApps", apps);

  componentDidMount() {
    this.getFormData();
  }

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
      app: data[connectedApp],
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
      onChangeProgress: this.handleProgress
    };
  }

  getConnectedApps(data) {
    const { connectedApps } = this.state;

    return data.reduce((acc, cur) => {
      return cur.completed ? [...acc, cur.id] : acc;
    }, connectedApps);
  }

  async getFormData() {
    const {
      value: { formId }
    } = this.props;

    let formData = await getForm(formId);

    if (formData.code && formData.code === 404) {
      formData = await createForm({
        body: {
          id: formId
        }
      });
    }

    this.setState({
      connectedApps: this.getConnectedApps(formData.integrations)
    });
  }

  handleConnectApp = appId => {
    const appStages = this.apps.find(app => app.id === appId);

    this.setState({
      stages: [...defaultStages, ...appStages.stages],
      connectedApp: appId
    });
  };

  handleDisconnectApp = appId => {
    const { connectedApps } = this.state;

    this.setState({
      connectedApps: connectedApps.filter(app => app !== appId)
    });
  };

  handleProgress = progress => {
    this.setState(progress);
  };

  handleChange = (id, appData) => {
    const { data } = this.state;

    this.setState({
      data: {
        ...data,
        [`${id}`]: {
          ...data[id],
          ...appData
        }
      }
    });
  };

  handleNext = nextStage => {
    this.setState(({ stage, stages }) => {
      const nextIdx = stages.findIndex(({ type }) => type === stage) + 1;

      return {
        stage: nextStage || stages[nextIdx].type,
        oldStage: stage
      };
    });
  };

  handlePrev = prevStage => {
    this.setState(({ stage, stages }) => {
      const prevIdx = stages.findIndex(({ type }) => type === stage) - 1;

      return {
        stage: prevStage || stages[prevIdx].type,
        oldStage: stage
      };
    });
  };

  renderTabItem() {
    const { connectedApp, data, stage } = this.state;
    const { img, title } = data[connectedApp] || {};

    if (img && title && stage !== "appList") {
      return (
        <div className="brz-ed-popup-tab-item active">
          <div className="brz-ed-popup-tab-image">
            <img className="brz-img" src={img} alt={title} />
          </div>
        </div>
      );
    }

    return (
      <div className="brz-ed-popup-tab-item active">
        <div className="brz-ed-popup-tab-icon brz-ed-popup-tab-icon__svg">
          <EditorIcon icon="nc-extensions-2" />
        </div>
        <div className="brz-ed-popup-tab-name">APPS</div>
      </div>
    );
  }

  render() {
    const { onClose } = this.props;
    const {
      showProgress: _showProgress,
      stage,
      stages,
      connectedApp
    } = this.state;
    const progressStage = stages.filter(({ title }) => title);
    const showProgress =
      _showProgress && !stages.find(el => el.type === stage).hideProgress;

    return (
      <Fixed onClose={onClose}>
        <div className="brz-ed-popup-wrapper brz-ed-popup-integrations">
          <div className="brz-ed-popup-header">
            <div className="brz-ed-popup-header__tabs">
              {this.renderTabItem()}
            </div>
            <div className="brz-ed-popup-btn-close" onClick={onClose} />
          </div>
          <div className="brz-ed-popup-content">
            <Context.Provider value={this.getContextValue()}>
              <Steppers stage={stage} apps={this.apps}>
                {showProgress && (
                  <Steppers.Progress>
                    {progressStage.map((step, index) => {
                      return (
                        <Steppers.Stage
                          key={index}
                          num={step.type}
                          text={capitalize(step.title)}
                        />
                      );
                    })}
                  </Steppers.Progress>
                )}
                <Steppers.Steps onClose={onClose}>
                  {stages.map((step, index) => {
                    return (
                      <Steppers.Step
                        key={index}
                        app={connectedApp}
                        num={step.type}
                      />
                    );
                  })}
                </Steppers.Steps>
              </Steppers>
            </Context.Provider>
          </div>
        </div>
      </Fixed>
    );
  }
}

export default PromptForm;

import React, { Component, ElementType, ReactElement } from "react";
import _ from "underscore";
import classnames from "classnames";
import produce from "immer";
import EditorIcon from "visual/component/EditorIcon";
import { Context } from "./Context";
import Steppers from "../Steppers";
import AppList from "./StepsView/AppsList";
import {
  AppData,
  BaseIntegrationContext,
  BaseIntegrationProps,
  BaseIntegrationState
} from "./type";
import { BaseAppElementTypes, BaseKey, BaseTypes } from "./BaseApp";

type AppComponent = {
  [k: string]: BaseTypes;
};

class BaseIntegration<
  TProps extends BaseIntegrationProps = BaseIntegrationProps,
  TState extends BaseIntegrationState = BaseIntegrationState,
  TContext extends BaseIntegrationContext = BaseIntegrationContext
> extends Component<TProps, TState> {
  static defaultProps = {
    className: "",
    tab: {},
    stage: "",
    stages: [],
    onLoading: _.noop,
    onTabUpdate: _.noop,
    onClose: _.noop
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  state: TState = {
    loading: true,
    showProgress: true,
    connectedApp: "",
    connectedApps: [],
    stage: this.props.stage,
    stages: this.props.stages,
    oldStage: "",
    data: {},
    error: null,
    appError: null
  };

  appsData: AppData[] = [];
  appsComponent: AppComponent = {};
  proExceptions = false;

  getContextValue(): BaseIntegrationContext {
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

  getConnectedApps(data: [] | unknown): Array<string> {
    const { connectedApps } = this.state;

    if (Array.isArray(data)) {
      return data.reduce((acc, cur) => {
        return cur.completed ? [...acc, cur.id] : acc;
      }, connectedApps);
    }

    return connectedApps;
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const { id, stages } = appData;

    this.setState(
      produce(draft => {
        draft.stages = stages;
        draft.connectedApp = id;
        draft.data[id] = appData;
      }),
      () => {
        this.handleNext();
      }
    );
  };

  handleDisconnectApp = (appId: string): void => {
    const { stage, stages } = this.props;

    this.setState(
      produce(draft => {
        const connectedApps = draft.connectedApps;

        draft.stage = stage;
        draft.stages = stages;
        draft.connectedApps = connectedApps.filter(
          (app: string) => app !== appId
        );
      })
    );
  };

  handleProgress = (progress: { showProgress: boolean }): void => {
    this.setState(progress);
  };

  handleChange = (id: string, appData: {}): void => {
    this.setState(
      produce(draft => {
        draft.data[id].data = appData;
      })
    );
  };

  getComponent<K extends BaseKey>(type: K): BaseTypes[K] {
    return this.appsComponent[this.state.connectedApp][type];
  }

  handleNext = async (_nextStage?: BaseKey): Promise<void> => {
    const { stages, stage } = this.state;
    const nextIdx = stages.findIndex(({ type }) => type === stage) + 1;
    const nextStage = _nextStage || stages[nextIdx].type;
    const Component = this.getComponent(nextStage) as BaseAppElementTypes;
    let pending = false;

    if (Component && typeof Component.onBeforeLoad === "function") {
      const nextStage = stages[nextIdx + 1].type;
      const props = {
        onChangeNext: (_nextStage?: BaseKey): void => {
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

  handlePrev = (prevStage: string): void => {
    this.setState(
      produce((draft: BaseIntegrationState) => {
        if (prevStage === "appList") {
          const { stage, stages } = this.props;

          draft.stage = stage;
          draft.stages = stages;
          draft.connectedApp = "";
        } else {
          const { stage, stages } = draft;
          const prevIdx = stages.findIndex(({ type }) => type === stage) - 1;

          draft.stage = prevStage || stages[prevIdx]?.type || "";
          draft.oldStage = stage;
          draft.connectedApp = prevIdx === -1 ? "" : draft.connectedApp;
        }
      })
    );
  };

  handleError = (error: null | string): void => {
    this.setState({ error });
  };

  renderLoading(): ReactElement {
    return (
      <div className="brz-ed-popup-content--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderError(): ReactElement {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.state.error}</span>
      </div>
    );
  }

  renderApps(): ReactElement {
    const { error, appError } = this.state;

    return (
      <>
        {error && this.renderError()}
        <AppList
          apps={this.appsData}
          proExceptions={this.proExceptions}
          error={appError}
        />
      </>
    );
  }

  renderSteps(): ReactElement {
    const {
      showProgress: _showProgress,
      stage,
      stages,
      connectedApp,
      data
    } = this.state;
    const showProgress =
      _showProgress && !stages.find(el => el.type === stage)?.hideProgress;
    const progress = stages.reduce((acc, cur, index, arr) => {
      const props: { num: BaseKey; img?: string; text?: string } = {
        num: cur.type
      };
      const firstNormalIndex = arr.findIndex(it => it.title);

      if (index === firstNormalIndex) {
        props.img = data[connectedApp].img;
      } else {
        props.text = cur.title;
      }

      return cur.title
        ? [...acc, <Steppers.Stage key={index} {...props} />]
        : acc;
    }, [] as Array<ReactElement>);

    return (
      <Context.Provider value={this.getContextValue()}>
        <Steppers stage={stage}>
          {showProgress && progress.length > 0 && (
            <Steppers.Progress>{progress}</Steppers.Progress>
          )}
          <Steppers.Steps onClose={this.props.onClose}>
            {stages.map((step, index) => {
              const Component = this.getComponent(step.type) as ElementType;

              return (
                <Steppers.Step
                  key={index}
                  num={step.type}
                  render={(props: {}): ReactElement | undefined =>
                    Component && <Component {...props} apps={this.appsData} />
                  }
                />
              );
            })}
          </Steppers.Steps>
        </Steppers>
      </Context.Provider>
    );
  }

  renderContent(): ReactElement {
    const { stage, stages } = this.state;

    return (
      <Context.Provider value={this.getContextValue()}>
        {stage !== "" && stages.length ? this.renderSteps() : this.renderApps()}
      </Context.Provider>
    );
  }

  render(): ReactElement {
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

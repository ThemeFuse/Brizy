import classnames from "classnames";
import { produce } from "immer";
import React, { Component, ElementType, ReactElement, ReactNode } from "react";
import _ from "underscore";
import { Alert } from "visual/component/Alert";
import { Loading } from "../Loading";
import Steppers from "../Steppers";
import { BaseAppElementTypes, BaseKey, BaseTypes } from "./BaseApp";
import { Context } from "./Context";
import AppList from "./StepsView/AppsList";
import {
  AppData,
  BaseIntegrationContext,
  BaseIntegrationProps,
  BaseIntegrationState
} from "./type";

type AppComponent = {
  [k: string]: BaseTypes;
};

class BaseIntegration<
  TProps extends BaseIntegrationProps = BaseIntegrationProps,
  TState extends BaseIntegrationState = BaseIntegrationState,
  TContext extends BaseIntegrationContext = BaseIntegrationContext
> extends Component<TProps, TState, TContext> {
  static defaultProps = {
    className: "",
    tab: {},
    stage: "",
    stages: [],
    onLoading: _.noop,
    onTabUpdate: _.noop,
    onClose: _.noop
  };

  // @ts-expect-error: incompatible state from generic need review this class component
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
    const { connectedApp, connectedApps, data, stages, stage, oldStage } =
      this.state;

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
      onError: this.handleError,
      config: this.props.config
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
      produce((draft) => {
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
      produce((draft) => {
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

  handleChange = (
    id: string,
    appData: Record<string, unknown> | null,
    cb?: VoidFunction
  ): void => {
    this.setState(
      produce((draft) => {
        draft.data[id].data = appData;
      }),
      () => {
        cb?.();
      }
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
      this.setState(
        produce((draft) => {
          draft.stage = nextStage;
          draft.oldStage = stage;
        })
      );
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
    return <Loading />;
  }

  renderError(): ReactNode {
    return this.state.error && <Alert message={this.state.error} />;
  }

  renderApps(): ReactElement {
    const { error, appError } = this.state;

    return (
      <>
        {error && <Alert message={error} />}
        <AppList
          apps={this.appsData}
          proExceptions={this.proExceptions}
          error={appError}
          hasDelete={false}
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
      _showProgress && !stages.find((el) => el.type === stage)?.hideProgress;
    const progress = stages.reduce((acc, cur, index, arr) => {
      const props: { num: BaseKey; img?: string; text?: string } = {
        num: cur.type
      };
      const firstNormalIndex = arr.findIndex((it) => it.title);

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
                  render={(
                    props: Record<string, unknown>
                  ): ReactElement | undefined =>
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
        {this.state.loading ? <Loading /> : this.renderContent()}
      </div>
    );
  }
}

export default BaseIntegration;

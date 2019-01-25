import React, { Component } from "react";
import * as AppsComponent from "../Apps";
import { AppList } from "../Step";
import { Context } from "../Context";

export default class Steps extends Component {
  static defaultProps = {
    stage: "",
    apps: []
  };

  render() {
    const { stage, apps, children, onConnectApp, onClose } = this.props;

    return React.Children.map(children, child => {
      return (
        stage === child.props.num &&
        React.cloneElement(child, {
          apps,
          onConnectApp,
          onClose
        })
      );
    });
  }
}

export class Step extends Component {
  static contextType = Context;

  static defaultProps = {
    num: "",
    app: ""
  };

  handleNext = async next => {
    const { stages, onChangeNext } = this.context;
    const { num, app } = this.props;
    const nextIdx = stages.findIndex(({ type }) => type === num) + 1;
    const nextStage = next || stages[nextIdx].type;
    const Component = AppsComponent[app][nextStage];
    let pending = false;

    if (typeof Component.onBeforeLoad === "function") {
      const nextStage = stages[nextIdx + 1].type;
      const props = {
        onChangeNext: () => {
          pending = true;
          this.handleNext(nextStage);
        }
      };
      await Component.onBeforeLoad(this.context, props);
    }

    if (!pending) {
      onChangeNext(next);
    }
  };

  render() {
    const { app, num, ...props } = this.props;
    const { onChangePrev } = this.context;

    if (num === "appList") {
      return (
        <AppList
          {...props}
          onChangePrev={onChangePrev}
          onChangeNext={this.handleNext}
        />
      );
    }

    const Component = AppsComponent[app][num];

    return (
      <Component
        {...props}
        onChangePrev={onChangePrev}
        onChangeNext={this.handleNext}
      />
    );
  }
}

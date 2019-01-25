import React, { Component } from "react";
import { Context } from "../../Context";
import { updateIntegration, fakeLoading } from "../../utils";
import ViewAccount from "./ViewAccount";
import ViewDisconnect from "./ViewDisconnect";

class Account extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);

    this.state = {
      active: this.getActiveAccount(context.app.data),
      mode: "account",
      nextLoading: false,
      prevLoading: false,
      connectLoading: false,
      disconnectLoading: false
    };
  }

  getActiveAccount(app) {
    const accounts = app.accounts.length ? app.accounts[0].id : "";

    return app.usedAccount || accounts;
  }

  handleActive = active => {
    this.setState({
      active
    });
  };

  handleConnect = async () => {
    this.setState({
      connectLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    this.context.onChangeProgress({
      showProgress: false
    });
    this.context.onChangePrev("connect");
  };

  handleDisconnect = async () => {
    const {
      app: { data },
      formId,
      onChange,
      onDisconnectApp,
      onChangeProgress
    } = this.context;

    this.setState({
      nextLoading: true
    });

    const integrationData = await updateIntegration({
      appId: data.id,
      formId,
      body: {
        ...data,
        usedAccount: null
      }
    });

    this.setState({
      mode: "account",
      nextLoading: false
    });

    onChange(data.id, { data: { ...data, ...integrationData } });
    onChangeProgress({
      showProgress: true
    });
    onDisconnectApp(data.id);
  };

  handleAccountMode = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await fakeLoading();

    this.context.onChangeProgress({
      showProgress: true
    });

    this.setState({
      mode: "account",
      prevLoading: false
    });
  };

  handleDisconnectMode = async () => {
    this.setState({
      disconnectLoading: true,
      error: null
    });

    // Emitted fake request
    await fakeLoading();

    this.context.onChangeProgress({
      showProgress: false
    });

    this.setState({
      mode: "disconnect",
      disconnectLoading: false
    });
  };

  handleNext = async () => {
    const {
      app: { data },
      formId,
      onChange
    } = this.context;

    const { active } = this.state;

    this.setState({
      nextLoading: true
    });

    if (active !== data.usedAccount) {
      const integrationData = await updateIntegration({
        appId: data.id,
        formId,
        body: {
          ...data,
          usedAccount: active
        }
      });

      onChange(data.id, { data: { ...data, ...integrationData } });
    } else {
      // Emitted fake request
      await fakeLoading();
    }

    this.props.onChangeNext();
  };

  handlePrev = async () => {
    const { onChangePrev } = this.context;

    this.setState({
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    onChangePrev("appList");
  };

  render() {
    const { app } = this.context;

    return this.state.mode === "account" ? (
      <ViewAccount
        {...app}
        {...this.state}
        handleActive={this.handleActive}
        handleConnect={this.handleConnect}
        handleDisconnect={this.handleDisconnectMode}
        handleConfirm={this.handleConfirm}
        handlePrev={this.handlePrev}
        handleNext={this.handleNext}
      />
    ) : (
      <ViewDisconnect
        {...app}
        {...this.state}
        handlePrev={this.handleAccountMode}
        handleNext={this.handleDisconnect}
      />
    );
  }
}

export default Account;

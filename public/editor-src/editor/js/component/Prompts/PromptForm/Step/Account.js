import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { updateIntegration } from "../api";
import { fakeRequest } from "../../common/utils";
import { Context } from "../../common/GlobalApps/Context";
import {
  Account as ViewAccount,
  Disconnect as ViewDisconnect
} from "../../common/GlobalApps/StepsView";

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
    this.setState({ active });
  };

  handleConnect = async () => {
    const { onChangeProgress, onChangePrev } = this.context;

    this.setState({ connectLoading: true });

    // Emitted fake request
    await fakeRequest();

    onChangeProgress({ showProgress: false });
    onChangePrev("connect");
  };

  handleDisconnect = async () => {
    const {
      app: { data: appData },
      formId,
      onChange,
      onDisconnectApp,
      onChangeProgress
    } = this.context;

    this.setState({
      nextLoading: true,
      error: null
    });

    const { status, data } = await updateIntegration({
      appId: appData.id,
      formId,
      body: {
        ...appData,
        usedAccount: null
      }
    });

    if (status !== 200) {
      this.setState({
        nextLoading: false,
        error: t("Something went wrong")
      });
    } else {
      this.setState({
        mode: "account",
        nextLoading: false
      });

      onChange(appData.id, { ...appData, ...data });
      onChangeProgress({ showProgress: true });
      onDisconnectApp(appData.id);
    }
  };

  handleAccountMode = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await fakeRequest();

    this.context.onChangeProgress({ showProgress: true });

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
    await fakeRequest();

    this.context.onChangeProgress({ showProgress: false });

    this.setState({
      mode: "disconnect",
      disconnectLoading: false
    });
  };

  handleNext = async () => {
    const {
      app: { data: appData },
      formId,
      onChange,
      onChangeNext
    } = this.context;

    const { active } = this.state;

    this.setState({
      nextLoading: true,
      error: null
    });

    if (active !== appData.usedAccount) {
      const { status, data } = await updateIntegration({
        appId: appData.id,
        formId,
        body: {
          ...appData,
          usedAccount: active
        }
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(appData.id, { ...appData, ...data });
        onChangeNext();
      }
    } else {
      // Emitted fake request
      await fakeRequest();
      onChangeNext();
    }
  };

  handlePrev = async () => {
    const { onChangePrev } = this.context;

    this.setState({
      prevLoading: true
    });

    // Emitted fake request
    await fakeRequest();

    onChangePrev("appList");
  };

  render() {
    const { app } = this.context;

    return this.state.mode === "account" ? (
      <ViewAccount
        {...app}
        {...this.state}
        onActive={this.handleActive}
        onConnect={this.handleConnect}
        onDisconnect={this.handleDisconnectMode}
        onConfirm={this.handleConfirm}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    ) : (
      <ViewDisconnect
        {...app}
        {...this.state}
        descriptions={`Subscribers are automatically synced to your ${
          app.title
        } list`}
        onPrev={this.handleAccountMode}
        onNext={this.handleDisconnect}
      />
    );
  }
}

export default Account;

import React, { Component } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import {
  Account as ViewAccount,
  Disconnect as ViewDisconnect
} from "../../common/GlobalApps/StepsView";
import { updateIntegration } from "../api";

interface AppData {
  accounts: Array<{ id: string }>;
  usedAccount: string | null;
  title: string;
}

interface Props {
  app: { id: string; data: AppData };
  formId: string;
  config: ConfigCommon;
  onChange: (id: string, data: AppData) => void;
  onDisconnectApp: (id: string) => void;
  onChangeProgress: (progress: { showProgress: boolean }) => void;
  onChangePrev: (step: string) => void;
  onChangeNext: VoidFunction;
}

interface State {
  active: string;
  mode: "account" | "disconnect";
  nextLoading: boolean;
  prevLoading: boolean;
  connectLoading: boolean;
  disconnectLoading: boolean;
  error: string | null;
}

class Account extends Component<Props, State> {
  static contextType = Context;

  constructor(props: Props, context: Props) {
    super(props);

    this.state = {
      active: this.getActiveAccount(context.app.data),
      mode: "account",
      nextLoading: false,
      prevLoading: false,
      connectLoading: false,
      disconnectLoading: false,
      error: null
    };
  }

  getActiveAccount(app: AppData): string {
    const accounts = app.accounts.length ? app.accounts[0].id : "";

    return app.usedAccount || accounts;
  }

  handleActive = (active: string): void => {
    this.setState({ active });
  };

  handleConnect = async (): Promise<void> => {
    const { onChangeProgress, onChangePrev } = this.context;

    this.setState({ connectLoading: true });

    // Emitted fake request
    await pendingRequest();

    onChangeProgress({ showProgress: false });
    onChangePrev("connect");
  };

  handleDisconnect = async (): Promise<void> => {
    const { config } = this.props;

    const {
      app: { id, data: appData },
      formId,
      onChange,
      onDisconnectApp,
      onChangeProgress
    } = this.context;

    this.setState({
      nextLoading: true,
      error: null
    });

    const { status, data } = await updateIntegration(
      {
        ...appData,
        formId,
        usedAccount: null
      },
      config
    );

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

      onChange(id, { ...appData, ...data });
      onChangeProgress({ showProgress: true });
      onDisconnectApp(id);
    }
  };

  handleAccountMode = async (): Promise<void> => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await pendingRequest();

    this.context.onChangeProgress({ showProgress: true });

    this.setState({
      mode: "account",
      prevLoading: false
    });
  };

  handleDisconnectMode = async (): Promise<void> => {
    this.setState({
      disconnectLoading: true,
      error: null
    });

    // Emitted fake request
    await pendingRequest();

    this.context.onChangeProgress({ showProgress: false });

    this.setState({
      mode: "disconnect",
      disconnectLoading: false
    });
  };

  handleNext = async (): Promise<void> => {
    const { config } = this.props;

    const {
      app: { id, data: appData },
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
      const { status, data } = await updateIntegration(
        {
          ...appData,
          formId,
          usedAccount: active
        },
        config
      );

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(id, { ...appData, ...data }, onChangeNext);
      }
    } else {
      // Emitted fake request
      await pendingRequest();
      onChangeNext();
    }
  };

  handlePrev = async (): Promise<void> => {
    const { onChangePrev } = this.context;

    this.setState({
      prevLoading: true
    });

    // Emitted fake request
    await pendingRequest();

    onChangePrev("appList");
  };

  render(): React.JSX.Element {
    const { app } = this.context;

    const disconnectDescriptions = `${t(
      "Subscribers are automatically synced to your"
    )} ${app.title}`;

    return this.state.mode === "account" ? (
      <ViewAccount
        {...app}
        {...this.state}
        onActive={this.handleActive}
        onConnect={this.handleConnect}
        onDisconnect={this.handleDisconnectMode}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    ) : (
      <ViewDisconnect
        {...app}
        {...this.state}
        descriptions={disconnectDescriptions}
        onPrev={this.handleAccountMode}
        onNext={this.handleDisconnect}
      />
    );
  }
}

export default Account;

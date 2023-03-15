import React, { Component } from "react";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Disconnect } from "../../common/GlobalApps/StepsView";
import { deleteAccount } from "../../common/GlobalApps/api";

class RecaptchaDisconnect extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      nextLoading: false,
      prevLoading: false,
      error: null
    };
  }

  handleNext = async () => {
    const { app, onChange, onDisconnectApp } = this.context;
    this.setState({
      nextLoading: true,
      error: null
    });

    const { status } = await deleteAccount(app.data.id);

    if (status < 400) {
      onDisconnectApp(app.id);
      onChange(app.id, null);
    } else {
      this.setState({
        nextLoading: false,
        error: t("Something went wrong")
      });
    }
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    await pendingRequest();

    this.context.onChangePrev("appList");
  };

  render() {
    const { nextLoading, prevLoading, error } = this.state;

    return (
      <Disconnect
        {...this.context.app}
        descriptions={`${t("Are you sure you want to delete your account?")}`}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        error={error}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }
}

export default RecaptchaDisconnect;

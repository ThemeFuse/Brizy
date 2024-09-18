import React, { Component } from "react";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Disconnect as ViewDisconnect } from "../../common/GlobalApps/StepsView";
import { deleteAccount } from "../../common/GlobalApps/api";

interface Props {
  descriptions: string;
  onPrev: Promise<void>;
  onNext: Promise<void>;
}

interface State {
  nextLoading: boolean;
  prevLoading: boolean;
  error: string | null;
}

class Disconnect extends Component<Props, State> {
  static contextType = Context;

  constructor(props: Props) {
    super(props);
    this.state = {
      nextLoading: false,
      prevLoading: false,
      error: null
    };
  }

  handleNext = async (): Promise<void> => {
    const { app, onChange, onDisconnectApp } = this.context;

    this.setState({
      nextLoading: true,
      error: null
    });

    const { status } = await deleteAccount(app.data.id);

    if (status === 200) {
      onDisconnectApp(app.id);
      onChange(app.id, null);
    } else {
      this.setState({
        nextLoading: false,
        error: t("Something went wrong")
      });
    }
  };

  handlePrev = async (): Promise<void> => {
    this.setState({
      prevLoading: true,
      error: null
    });

    await pendingRequest();

    this.context.onChangePrev("appList");
  };

  render(): React.JSX.Element {
    const { nextLoading, prevLoading, error } = this.state;

    return (
      <ViewDisconnect
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

export default Disconnect;

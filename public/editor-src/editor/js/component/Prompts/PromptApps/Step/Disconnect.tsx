import React, { Component } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { deleteAccount, pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Disconnect as ViewDisconnect } from "../../common/GlobalApps/StepsView";

interface Props {
  descriptions: string;
  config: ConfigCommon;
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
  declare context: React.ContextType<typeof Context>;

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

    if (!app.data?.id) {
      this.setState({
        nextLoading: false,
        error: t("Something went wrong missing app id")
      });
      return;
    }

    this.setState({
      nextLoading: true,
      error: null
    });

    const { success } = await deleteAccount(app.data.id, this.props.config);

    if (success) {
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

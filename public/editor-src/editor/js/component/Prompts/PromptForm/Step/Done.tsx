import React, { Component, ReactElement } from "react";
import { Context } from "../../common/GlobalApps/Context";
import { Done as ViewDone } from "../../common/GlobalApps/StepsView";

type Props = {
  onClose: () => void;
};

class Done extends Component<Props> {
  static contextType = Context;

  handleClose = (): void => {
    this.props.onClose();
  };

  render(): ReactElement {
    const { app } = this.context;

    return <ViewDone {...app} onNext={this.handleClose} />;
  }
}

export default Done;

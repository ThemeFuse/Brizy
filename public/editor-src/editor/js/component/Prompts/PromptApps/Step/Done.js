import React, { Component } from "react";
import { Context } from "../../common/GlobalApps/Context";
import { Done as ViewDone } from "../../common/GlobalApps/StepsView";

class Done extends Component {
  static contextType = Context;

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { app } = this.context;

    return <ViewDone {...app} onNext={this.handleClose} />;
  }
}

export default Done;

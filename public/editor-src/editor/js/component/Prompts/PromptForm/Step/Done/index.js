import React, { Component } from "react";
import { Context } from "../../Context";
import ViewDone from "./ViewDone";

class Done extends Component {
  static contextType = Context;

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { app } = this.context;

    return <ViewDone {...app} handleNext={this.handleClose} />;
  }
}

export default Done;

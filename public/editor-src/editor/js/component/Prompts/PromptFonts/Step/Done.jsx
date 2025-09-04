import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Done as ViewDone } from "../../common/GlobalApps/StepsView";
import { DoneWithWarning } from "./DoneWithWarning";

class Done extends Component {
  static contextType = Context;

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { app } = this.context;
    const { exists, fontName } = app.data;

    return exists ? (
      <DoneWithWarning onDone={this.handleClose}>
        {t("Couldn't complete the upload as the font named ")}
        <strong>{fontName}</strong>
        {t(" already exists in the project.")}
      </DoneWithWarning>
    ) : (
      <ViewDone {...app} onNext={this.handleClose} />
    );
  }
}

export default Done;

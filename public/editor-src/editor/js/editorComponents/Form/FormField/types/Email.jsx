import React from "react";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";

export default class Email extends TextField {
  static get componentTitle() {
    return t("Email");
  }
  static get componentType() {
    return "Email";
  }

  static pattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$";

  renderForEdit = (props) => {
    return <input className="brz-input brz-forms__field" {...props} />;
  };

  renderForView = (props) => {
    return (
      <input
        className="brz-input brz-forms__field"
        type="email"
        maxLength="255"
        {...props}
      />
    );
  };
}

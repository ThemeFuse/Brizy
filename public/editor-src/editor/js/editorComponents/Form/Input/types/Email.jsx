import React from "react";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Email extends TextField {
  static get componentTitle() {
    return t("Email");
  }
  static get componentType() {
    return "Email";
  }

  static pattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$";

  renderForEdit = props => {
    return <input className="brz-input brz-form__field" {...props} />;
  };

  renderForView = props => {
    return (
      <input className="brz-input brz-form__field" type="email" {...props} />
    );
  };
}

import React from "react";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Number extends TextField {
  static get componentTitle() {
    return t("Number");
  }
  static get componentType() {
    return "Number";
  }

  static pattern = "^-?[0-9]\\d*(\\.\\d+)?$";

  renderForEdit = props => {
    return <input className="brz-input brz-forms__field" {...props} />;
  };

  renderForView = props => {
    return (
      <input className="brz-input brz-forms__field" type="number" {...props} />
    );
  };
}

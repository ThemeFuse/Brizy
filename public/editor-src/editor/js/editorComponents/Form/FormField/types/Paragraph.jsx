import React from "react";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Paragraph extends TextField {
  static get componentTitle() {
    return t("Paragraph");
  }
  static get componentType() {
    return "Paragraph";
  }

  renderForEdit = props => {
    return <textarea className="brz-textarea brz-forms__field" {...props} />;
  };
}

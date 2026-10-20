import React from "react";
import { t } from "visual/utils/i18n";
import TextField from "./common/TextField";

export default class Text extends TextField {
  static get componentTitle() {
    return t("Text");
  }
  static get componentType() {
    return "Text";
  }

  renderForEdit = (props) => {
    return <input className="brz-input brz-forms__field" {...props} />;
  };
}

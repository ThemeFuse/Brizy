import React from "react";
import TextField from "./common/TextField";
import { t } from "visual/utils/i18n";

export default class Hidden extends TextField {
  static get componentTitle() {
    return t("Hidden");
  }

  static get componentType() {
    return "Hidden";
  }

  static Label(...props) {
    // input hidden don't have label on preview
    return IS_EDITOR ? super.Label(...props) : null;
  }

  renderForView(v) {
    const { attr } = v;

    return (
      <input {...attr} required={false} className={this.getClassName(v)} />
    );
  }
}
